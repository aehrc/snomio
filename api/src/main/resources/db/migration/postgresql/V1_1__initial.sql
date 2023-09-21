create or replace function drop_all_tables_in_schema() returns void as $$
declare
    r record;
BEGIN
    for r IN (select tablename from pg_tables where schemaname = 'public') loop
        execute 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    end loop;
    execute 'DROP SEQUENCE IF EXISTS revinfo_seq;';
end;
$$ language plpgsql;

create sequence revinfo_seq start with 1 increment by 50;
create table additional_field_type (list_type boolean, version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255) unique, primary key (id));
create table additional_field_type_aud (list_type boolean, rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table additional_field_value (version integer, additional_field_type_id bigint, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), value_of varchar(255), primary key (id));
create table additional_field_value_aud (rev integer not null, revtype smallint, additional_field_type_id bigint, id bigint not null, value_of varchar(255), primary key (rev, id));
create table attachment (length integer, version integer, attachment_type_id bigint, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), filename varchar(255), location varchar(255), modified_by varchar(255), sha256 varchar(255), primary key (id));
create table attachment_aud (length integer, rev integer not null, revtype smallint, attachment_type_id bigint, id bigint not null, description varchar(255), filename varchar(255), location varchar(255), sha256 varchar(255), primary key (rev, id));
create table attachment_type (id bigint generated by default as identity, mime_type varchar(255) unique, name varchar(255), primary key (id));
create table attachment_type_aud (rev integer not null, revtype smallint, id bigint not null, mime_type varchar(255), name varchar(255), primary key (rev, id));
create table comment (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, text varchar(1000000), created_by varchar(255), modified_by varchar(255), primary key (id));
create table comment_aud (rev integer not null, revtype smallint, id bigint not null, text varchar(1000000), primary key (rev, id));
create table iteration (active boolean, completed boolean, version integer, created timestamp(6) with time zone not null, end_date timestamp(6) with time zone, id bigint generated by default as identity, modified timestamp(6) with time zone, start_date timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), name varchar(255) unique, primary key (id));
create table iteration_aud (active boolean, completed boolean, rev integer not null, revtype smallint, end_date timestamp(6) with time zone, id bigint not null, start_date timestamp(6) with time zone, name varchar(255), primary key (rev, id));
create table label (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), display_color varchar(255), modified_by varchar(255), name varchar(255) unique, primary key (id));
create table label_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), display_color varchar(255), name varchar(255), primary key (rev, id));
create table priority_bucket (order_index integer, version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255) unique, primary key (id));
create table priority_bucket_aud (order_index integer, rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table revinfo (rev integer generated by default as identity, revtstmp bigint, primary key (rev));
create table state (grouping integer, version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), label varchar(255) unique, modified_by varchar(255), primary key (id));
create table state_aud (grouping integer, rev integer not null, revtype smallint, id bigint not null, description varchar(255), label varchar(255), primary key (rev, id));
create table task_association (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), task_id varchar(255), primary key (id));
create table task_association_aud (rev integer not null, revtype smallint, id bigint not null, task_id varchar(255), primary key (rev, id));
create table ticket (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, iteration_id bigint, modified timestamp(6) with time zone, priority_bucket_id bigint, state_id bigint, ticket_type_id bigint, description varchar(1000000), assignee varchar(255), created_by varchar(255), modified_by varchar(255), title varchar(255), primary key (id));
create table ticket_additional_field_values (additional_field_value_id bigint not null, ticket_id bigint not null, primary key (additional_field_value_id, ticket_id));
create table ticket_additional_field_values_aud (rev integer not null, revtype smallint, additional_field_value_id bigint not null, ticket_id bigint not null, primary key (rev, additional_field_value_id, ticket_id));
create table ticket_association (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, ticket_id bigint, created_by varchar(255), description varchar(255), modified_by varchar(255), primary key (id));
create table ticket_association_aud (rev integer not null, revtype smallint, id bigint not null, ticket_id bigint, description varchar(255), primary key (rev, id));
create table ticket_attachments (attachment_id bigint not null unique, ticket_id bigint not null);
create table ticket_attachments_aud (rev integer not null, revtype smallint, attachment_id bigint not null, ticket_id bigint not null, primary key (rev, attachment_id, ticket_id));
create table ticket_aud (rev integer not null, revtype smallint, id bigint not null, iteration_id bigint, priority_bucket_id bigint, state_id bigint, ticket_type_id bigint, description varchar(1000000), assignee varchar(255), title varchar(255), primary key (rev, id));
create table ticket_comments (comment_id bigint not null unique, ticket_id bigint not null);
create table ticket_comments_aud (rev integer not null, revtype smallint, comment_id bigint not null, ticket_id bigint not null, primary key (rev, comment_id, ticket_id));
create table ticket_labels (label_id bigint not null, ticket_id bigint not null);
create table ticket_labels_aud (rev integer not null, revtype smallint, label_id bigint not null, ticket_id bigint not null, primary key (rev, label_id, ticket_id));
create table ticket_tasks (task_id bigint not null unique, ticket_id bigint not null);
create table ticket_tasks_aud (rev integer not null, revtype smallint, task_id bigint not null, ticket_id bigint not null, primary key (rev, task_id, ticket_id));
create table ticket_type (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), description varchar(255), modified_by varchar(255), name varchar(255) unique, primary key (id));
create table ticket_type_aud (rev integer not null, revtype smallint, id bigint not null, description varchar(255), name varchar(255), primary key (rev, id));
create table transition (version integer, created timestamp(6) with time zone not null, id bigint generated by default as identity, modified timestamp(6) with time zone, created_by varchar(255), modified_by varchar(255), name varchar(255), primary key (id));
create table transition_aud (rev integer not null, revtype smallint, id bigint not null, name varchar(255), primary key (rev, id));
alter table if exists additional_field_type_aud add constraint FKbgsd4467o3blnp1ad306oef04 foreign key (rev) references revinfo;
alter table if exists additional_field_value add constraint FK7km4lag61250nuye0lb1hpkwx foreign key (additional_field_type_id) references additional_field_type;
alter table if exists additional_field_value_aud add constraint FK9gj920cw2f5kuws1hgdvm0rfq foreign key (rev) references revinfo;
alter table if exists attachment add constraint FK4s28ubnea2363j8tkm4q3eqs4 foreign key (attachment_type_id) references attachment_type;
alter table if exists attachment_aud add constraint FKg5d9474r1oeaw1mus6wno60p1 foreign key (rev) references revinfo;
alter table if exists attachment_type_aud add constraint FK9jod3u6rae7n1a8ex71d6brjj foreign key (rev) references revinfo;
alter table if exists comment_aud add constraint FKo1q5p3hhua10tousqu4m2hn3n foreign key (rev) references revinfo;
alter table if exists iteration_aud add constraint FKlsncnby57o15s16naeo5shcx3 foreign key (rev) references revinfo;
alter table if exists label_aud add constraint FKcvfbrs7y5fmy2xs9hvsokkik8 foreign key (rev) references revinfo;
alter table if exists priority_bucket_aud add constraint FKfyq8qp6bl0y8xapm8ex2j8cs1 foreign key (rev) references revinfo;
alter table if exists state_aud add constraint FKn5hv7v20t9mjlm6ckhp88lt3a foreign key (rev) references revinfo;
alter table if exists task_association_aud add constraint FK24lcc1yibujuscx13rthxu2wa foreign key (rev) references revinfo;
alter table if exists ticket add constraint FKaua0mbrxtvglbs34h626crsbb foreign key (iteration_id) references iteration;
alter table if exists ticket add constraint FKb16pi9es9yytjelh4bwq8xx15 foreign key (priority_bucket_id) references priority_bucket;
alter table if exists ticket add constraint FK3ao61nmy36jkwhumn0g8tploa foreign key (state_id) references state;
alter table if exists ticket add constraint FKicdt7jp8dniw1fw6y8y0u9gcr foreign key (ticket_type_id) references ticket_type;
alter table if exists ticket_additional_field_values add constraint FKnbki2545absnfvblyuq2svece foreign key (additional_field_value_id) references additional_field_value;
alter table if exists ticket_additional_field_values add constraint FK6u8efi7mkgxhq7jsibvnimtbn foreign key (ticket_id) references ticket;
alter table if exists ticket_additional_field_values_aud add constraint FKcvxg0kl0fcm3u7xo04kmsit1v foreign key (rev) references revinfo;
alter table if exists ticket_association add constraint FKfqtq8owhi5hno3vei7jt8bids foreign key (ticket_id) references ticket;
alter table if exists ticket_association_aud add constraint FK1cj9dlnwkrup41rqfg0ie39qx foreign key (rev) references revinfo;
alter table if exists ticket_attachments add constraint FK79c2dmfp4o7urqfrt9n56aw2s foreign key (attachment_id) references attachment;
alter table if exists ticket_attachments add constraint FKbqs6ho9h2hxfj7ym3h3ih6ful foreign key (ticket_id) references ticket;
alter table if exists ticket_attachments_aud add constraint FKp02fdxu99e9flrv509l4j7hym foreign key (rev) references revinfo;
alter table if exists ticket_aud add constraint FKv5jck8ph8ewy6d78xvgkl6au foreign key (rev) references revinfo;
alter table if exists ticket_comments add constraint FKsh8niax9sj0qdlbpbdlb46b60 foreign key (comment_id) references comment;
alter table if exists ticket_comments add constraint FK7o9jd07fbf5xo43itq2pvyd03 foreign key (ticket_id) references ticket;
alter table if exists ticket_comments_aud add constraint FKhk017pgwa8ever137tos3jb9v foreign key (rev) references revinfo;
alter table if exists ticket_labels add constraint FK5aax7mrljawim0bad9xcow5h foreign key (label_id) references label;
alter table if exists ticket_labels add constraint FKjkbij6aeium79m7r20d8h93io foreign key (ticket_id) references ticket;
alter table if exists ticket_labels_aud add constraint FKkc41v4m14319bn6rere765jhm foreign key (rev) references revinfo;
alter table if exists ticket_tasks add constraint FK8twlqosfga3pht4ynev60g1my foreign key (task_id) references task_association;
alter table if exists ticket_tasks add constraint FKnbyd5rwnukhkx2huaqj7mmpdn foreign key (ticket_id) references ticket;
alter table if exists ticket_tasks_aud add constraint FKdnhklfiyt8ncu0jnbovkl8ox6 foreign key (rev) references revinfo;
alter table if exists ticket_type_aud add constraint FK18gy4bfyy2grx0ocrk067geyp foreign key (rev) references revinfo;
alter table if exists transition_aud add constraint FKcrinml6spv9vrt0spfb4jqbsm foreign key (rev) references revinfo;
