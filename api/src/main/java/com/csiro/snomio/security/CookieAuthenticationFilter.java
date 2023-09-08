package com.csiro.snomio.security;

import com.csiro.snomio.exception.AuthenticationProblem;
import com.csiro.snomio.helper.AuthHelper;
import com.csiro.snomio.models.ImsUser;
import com.csiro.snomio.service.LoginService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class CookieAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private LoginService loginService;

  @Autowired
  private AuthHelper authHelper;

  @Autowired
  private HandlerExceptionResolver handlerExceptionResolver;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    try {
      Cookie cookie = authHelper.getImsCookie(request);

      if (cookie == null) {
        throw new AuthenticationProblem("No cookie received");
      }

      String cookieString = cookie.getValue();

      ImsUser user = loginService.getUserByToken(cookieString);
      List<String> roles = user.getRoles();

      Set<GrantedAuthority> gas = new HashSet<>();

      for (String role : roles) {
        gas.add(new SimpleGrantedAuthority(role));
      }

      Authentication authentication =
          new UsernamePasswordAuthenticationToken(user, cookieString, gas);

      SecurityContextHolder.getContext().setAuthentication(authentication);
      filterChain.doFilter(request, response);

    } catch (AuthenticationProblem ex) {
      logger.error("Could not validate cookie");
      handlerExceptionResolver.resolveException(request, response, null, ex);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return !path.startsWith("/api");
  }
}
