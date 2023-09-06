create sequence revinfo_seq start with 1 increment by 50;
create table additional_field (version integer, additional_field_type_id bigint, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), modified_by varchar(255), value_of varchar(255), primary key (id));
create table additional_field_aud (rev integer not null, revtype smallint, additional_field_type_id bigint, id bigint not null, ticket_id bigint, value_of varchar(255), primary key (rev, id));
create table additional_field_type (id bigint generated by default as identity, description varchar(255), name varchar(255), primary key (id));
create table additional_field_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table attachment (length integer, version integer, attachment_type_id bigint, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), data varchar(255), description varchar(255), modified_by varchar(255), sha256 varchar(255), primary key (id));
create table attachment_aud (length integer, rev integer not null, revtype smallint, attachment_type_id bigint, id bigint not null, ticket_id bigint, data varchar(255), description varchar(255), sha256 varchar(255), primary key (rev, id));
create table attachment_type (id bigint generated by default as identity, mime_type varchar(255), name varchar(255), primary key (id));
create table attachment_type_aud (rev integer not null, revtype smallint, id bigint not null, mime_type varchar(255), name varchar(255), primary key (rev, id));
create table comment (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), modified_by varchar(255), text varchar(255), primary key (id));
create table comment_aud (rev integer not null, revtype smallint, id bigint not null, ticket_id bigint, text varchar(255), primary key (rev, id));
create table iteration (active boolean, completed boolean, version integer, created timestamp(6) with time zone not null, end_date timestamp(6) with time zone, id bigint generated by default as identity, modified timestamp(6) with time zone, start_date timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table iteration_aud (active boolean, completed boolean, rev integer not null, revtype smallint, end_date timestamp(6) with time zone, id bigint not null, start_date timestamp(6) with time zone, name varchar(255), primary key (rev, id));
create table label (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), display_color varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table label_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), display_color varchar(255), name varchar(255), primary key (rev, id));
create table labels (label_id bigint not null, ticket_id bigint not null);
create table labels_aud (rev integer not null, revtype smallint, label_id bigint not null, ticket_id bigint not null, primary key (rev, label_id, ticket_id));
create table priority_bucket (order_index integer, version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table priority_bucket_aud (order_index integer, rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table revinfo (rev integer generated by default as identity, revtstmp bigint, primary key (rev));
create table state (grouping integer, version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), label varchar(255), modified_by varchar(255), primary key (id));
create table state_aud (grouping integer, rev integer not null, revtype smallint, id bigint not null, description varchar(255), label varchar(255), primary key (rev, id));
create table ticket (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, iteration_id bigint, modified timestamp(6) with time zone, priority_bucket_id bigint, state_id bigint, ticket_type_id bigint, assignee varchar(255), created_by varchar(255), description varchar(255), modified_by varchar(255), title varchar(255), primary key (id));
create table ticket_association (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), description varchar(255), modified_by varchar(255), primary key (id));
create table ticket_association_aud (rev integer not null, revtype smallint, id bigint not null, ticket_id bigint, description varchar(255), primary key (rev, id));
create table ticket_aud (rev integer not null, revtype smallint, created timestamp(6) with time zone, id bigint not null, iteration_id bigint, modified timestamp(6) with time zone, priority_bucket_id bigint, state_id bigint, ticket_type_id bigint, assignee varchar(255), created_by varchar(255), description varchar(255), modified_by varchar(255), title varchar(255), primary key (rev, id));
create table ticket_type (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table ticket_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table transition (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table transition_aud (rev integer not null, revtype smallint, id bigint not null, name varchar(255), primary key (rev, id));
alter table if exists additional_field add constraint FKdvhn5ynf5h9fa61oi11exhm3h foreign key (additional_field_type_id) references additional_field_type;
alter table if exists additional_field add constraint FK32rr8q2nflo6q1w9pdgyr1ktj foreign key (ticket_id) references ticket;
alter table if exists additional_field_aud add constraint FKgu3b786krfdk76j71xv30n6cr foreign key (rev) references revinfo;
alter table if exists additional_field_type_aud add constraint FKbgsd4467o3blnp1ad306oef04 foreign key (rev) references revinfo;
alter table if exists attachment add constraint FK4s28ubnea2363j8tkm4q3eqs4 foreign key (attachment_type_id) references attachment_type;
alter table if exists attachment add constraint FKedqxly6v2mkdjt67ujfn47qh9 foreign key (ticket_id) references ticket;
alter table if exists attachment_aud add constraint FKg5d9474r1oeaw1mus6wno60p1 foreign key (rev) references revinfo;
alter table if exists attachment_type_aud add constraint FK9jod3u6rae7n1a8ex71d6brjj foreign key (rev) references revinfo;
alter table if exists comment add constraint FKsyf8wt2qb7rhcau6v3p4axrba foreign key (ticket_id) references ticket;
alter table if exists comment_aud add constraint FKo1q5p3hhua10tousqu4m2hn3n foreign key (rev) references revinfo;
alter table if exists iteration_aud add constraint FKlsncnby57o15s16naeo5shcx3 foreign key (rev) references revinfo;
alter table if exists label_aud add constraint FKcvfbrs7y5fmy2xs9hvsokkik8 foreign key (rev) references revinfo;
alter table if exists labels add constraint FKnwhlrrtadv00ylq1y2e129pkl foreign key (label_id) references label;
alter table if exists labels add constraint FK9osrgv5tri6unduo4fuit7oug foreign key (ticket_id) references ticket;
alter table if exists labels_aud add constraint FKmf2yusoar03kv0pystfmiti5q foreign key (rev) references revinfo;
alter table if exists priority_bucket_aud add constraint FKfyq8qp6bl0y8xapm8ex2j8cs1 foreign key (rev) references revinfo;
alter table if exists state_aud add constraint FKn5hv7v20t9mjlm6ckhp88lt3a foreign key (rev) references revinfo;
alter table if exists ticket add constraint FKaua0mbrxtvglbs34h626crsbb foreign key (iteration_id) references iteration;
alter table if exists ticket add constraint FKb16pi9es9yytjelh4bwq8xx15 foreign key (priority_bucket_id) references priority_bucket;
alter table if exists ticket add constraint FK3ao61nmy36jkwhumn0g8tploa foreign key (state_id) references state;
alter table if exists ticket add constraint FKicdt7jp8dniw1fw6y8y0u9gcr foreign key (ticket_type_id) references ticket_type;
alter table if exists ticket_association add constraint FKfqtq8owhi5hno3vei7jt8bids foreign key (ticket_id) references ticket;
alter table if exists ticket_association_aud add constraint FK1cj9dlnwkrup41rqfg0ie39qx foreign key (rev) references revinfo;
alter table if exists ticket_aud add constraint FKv5jck8ph8ewy6d78xvgkl6au foreign key (rev) references revinfo;
alter table if exists ticket_type_aud add constraint FK18gy4bfyy2grx0ocrk067geyp foreign key (rev) references revinfo;
alter table if exists transition_aud add constraint FKcrinml6spv9vrt0spfb4jqbsm foreign key (rev) references revinfo;
