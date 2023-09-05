create sequence revinfo_seq start with 1 increment by 50;
create table if not exists additional_field (version integer, additional_field_type_id bigint, created timestamp(6) not null, id bigint, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), modified_by varchar(255), value_of varchar(255), primary key (id));
create table if not exists additional_field_aud (rev integer not null, revtype smallint, additional_field_type_id bigint, id bigint not null, ticket_id bigint, value_of varchar(255), primary key (rev, id));
create table if not exists additional_field_type (id bigint, description varchar(255), name varchar(255), primary key (id));
create table if not exists additional_field_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table if not exists attachment (length integer, version integer, attachment_type_id bigint, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), data varchar(255), description varchar(255), modified_by varchar(255), sha256 varchar(255), primary key (id));
create table if not exists attachment_aud (length integer, rev integer not null, revtype smallint, attachment_type_id bigint, id bigint not null, ticket_id bigint, data varchar(255), description varchar(255), sha256 varchar(255), primary key (rev, id));
create table if not exists attachment_type (id bigint, mime_type varchar(255), name varchar(255), primary key (id));
create table if not exists attachment_type_aud (rev integer not null, revtype smallint, id bigint not null, mime_type varchar(255), name varchar(255), primary key (rev, id));
create table if not exists comment (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), modified_by varchar(255), text varchar(255), primary key (id));
create table if not exists comment_aud (rev integer not null, revtype smallint, id bigint not null, ticket_id bigint, text varchar(255), primary key (rev, id));
create table if not exists label (version integer, created timestamp(6) with time zone not null, id bigint, label_type_id bigint, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), modified_by varchar(255), primary key (id));
create table if not exists label_aud (rev integer not null, revtype smallint, id bigint not null, label_type_id bigint, ticket_id bigint, primary key (rev, id));
create table if not exists label_type (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table if not exists label_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table if not exists label_type_label (label_id bigint not null unique, label_type_id bigint not null);
create table if not exists label_type_label_aud (rev integer not null, revtype smallint, label_id bigint not null, label_type_id bigint not null, primary key (rev, label_id, label_type_id));
create table if not exists revinfo (rev integer, revtstmp bigint, primary key (rev));
create table if not exists state (grouping integer, version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), label varchar(255), modified_by varchar(255), primary key (id));
create table if not exists state_aud (grouping integer, rev integer not null, revtype smallint, id bigint not null, description varchar(255), label varchar(255), primary key (rev, id));
create table if not exists ticket (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, state_id bigint, ticket_type_id bigint, created_by varchar(255), description varchar(255), modified_by varchar(255), title varchar(255), primary key (id));
create table if not exists ticket_association (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), description varchar(255), modified_by varchar(255), primary key (id));
create table if not exists ticket_association_aud (rev integer not null, revtype smallint, id bigint not null, ticket_id bigint, description varchar(255), primary key (rev, id));
create table if not exists ticket_aud (rev integer not null, revtype smallint, created timestamp(6) with time zone, id bigint not null, modified timestamp(6) with time zone, state_id bigint, ticket_type_id bigint, created_by varchar(255), description varchar(255), modified_by varchar(255), title varchar(255), primary key (rev, id));
create table if not exists ticket_type (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table if not exists ticket_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table if not exists transition (version integer, created timestamp(6) with time zone not null, id bigint, modified timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table if not exists transition_aud (rev integer not null, revtype smallint, id bigint not null, name varchar(255), primary key (rev, id));
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
alter table if exists label add constraint FKocrbkux95f20h52j712ah0hv4 foreign key (label_type_id) references label_type;
alter table if exists label add constraint FKgqe5568mgikdkqbev2m1es2y0 foreign key (ticket_id) references ticket;
alter table if exists label_aud add constraint FKcvfbrs7y5fmy2xs9hvsokkik8 foreign key (rev) references revinfo;
alter table if exists label_type_aud add constraint FK2celp1r6q8e19d3lyydb51v80 foreign key (rev) references revinfo;
alter table if exists label_type_label add constraint FKn6toyoudji4e9ux3x95790bo7 foreign key (label_id) references label;
alter table if exists label_type_label add constraint FKthiaeelwqh2s1vh3r1suj14ns foreign key (label_type_id) references label_type;
alter table if exists label_type_label_aud add constraint FK9b1c0fqs9m7y6ke4gr8f6bw0c foreign key (rev) references revinfo;
alter table if exists state_aud add constraint FKn5hv7v20t9mjlm6ckhp88lt3a foreign key (rev) references revinfo;
alter table if exists ticket add constraint FK3ao61nmy36jkwhumn0g8tploa foreign key (state_id) references state;
alter table if exists ticket add constraint FKicdt7jp8dniw1fw6y8y0u9gcr foreign key (ticket_type_id) references ticket_type;
alter table if exists ticket_association add constraint FKfqtq8owhi5hno3vei7jt8bids foreign key (ticket_id) references ticket;
alter table if exists ticket_association_aud add constraint FK1cj9dlnwkrup41rqfg0ie39qx foreign key (rev) references revinfo;
alter table if exists ticket_aud add constraint FKv5jck8ph8ewy6d78xvgkl6au foreign key (rev) references revinfo;
alter table if exists ticket_type_aud add constraint FK18gy4bfyy2grx0ocrk067geyp foreign key (rev) references revinfo;
alter table if exists transition_aud add constraint FKcrinml6spv9vrt0spfb4jqbsm foreign key (rev) references revinfo;
