--
-- PostgreSQL database dump
--

\restrict NIUuggsaXnpQR6kehhdgan7QReYza0G0CG5VNGMTN4JFD5YkMw9xfOUNawWmRlQ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "emailVerified", image, "isActive", "planType", "createdAt", "updatedAt", password, role, username, "stripeCurrentPeriodEnd", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", whatsapp, "lastPaymentAmount", "lastPaymentCurrency", expires_at, notification_active, plan_price, connections, app_name, device_type, location) FROM stdin;
3df113a3-ad95-4c37-bcc2-fdf4d532b756	matheus Portugal	matheus01@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:00:03.127	2026-04-28 14:00:28.917	$2b$10$RTua/UU0F.eA08iZHw3sO.IVSoQfE6exV8ms11DE3eUQiVLFKE//y	USER	05635933	\N	\N	\N	\N	+35196857772	9	EUR	2026-06-23 15:06:33.79+00	f	9.00	1	XCLOUD	LG	Portugal
1ebae11a-e2f2-477b-aeca-d3edd7b460dd	Matheus Portugal	matheus02@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:03:33.222	2026-04-28 14:05:08.517	$2b$10$Oq9ht3egKyqZ6VD9JUtO.ejj.GwtD34211OQiQjKjoYMFRW.kh2.K	USER	91684556	\N	\N	\N	\N	+351968577772	9	EUR	2026-06-23 15:06:38.839+00	f	9.00	1	SFL miTV	ANDROID TV	Portugal
1f0b5544-d04a-46bd-b7a9-be6df3bb5c77	David Rodrigues Portugal	davidportugal@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:07:40.391	2026-04-28 14:08:07.317	$2b$10$N1J5CAqoMD8tbJavZox4A.Yym8RrsoV4tJLMByxt9F4qpFONfbnq.	USER	798467	\N	\N	\N	\N	+351969463414	9	EUR	2026-06-23 15:06:45.712+00	f	9.00	1	Implayer	ANDROID TV	Portugal
4e817e55-7cb4-49f7-848a-b398de2bf151	Erikson	eroksonportugal@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 13:51:35.479	2026-04-28 13:54:27.309	$2b$10$wOLsokztycJwpmUnDls/B.cwJBddkC1U82Yk7BXuGdRFCH4VNgC4S	USER	50228755	\N	\N	\N	\N	+351934332942	9	EUR	2026-06-23 15:06:28.022+00	f	9.00	1	Android	SMART TV	Portugal
4dba3328-d21f-4915-bd53-2517dc0e0e85	Rodofo (Irmão)	rodofoirmao@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 13:17:32.875	2026-04-28 13:18:05.038	$2b$10$Tivd7q/k1mHFfgsGiOBMMOhhwuTeNkCxBJeUJTzZHuzkCfYeGK.Ja	USER	88735622	\N	\N	\N	\N	+351913378971	9	EUR	2026-06-23 15:06:10.929+00	f	9.00	1	IoWebs	LG	Portugal
aa74fabb-3449-4545-bfbf-62cb3e3bd00f	Murilo	murilo@sflgrupo.com	\N	\N	t	VIP	2026-04-28 14:15:28.967	2026-04-28 14:15:54.685	$2b$10$x3R3RdJb7OFwk5y15LVmfOMuVh//OsnDQk6q6i2B7m1otmSMzGuZm	USER	Mu30lo	\N	\N	\N	\N	+5577991151851	40	BRL	2026-06-23 15:06:53.855+00	f	40.00	1	FireStik	SMART TV	Vitoria da Conquista
10912abf-7339-4845-a0a6-55f58e25006e	Natiele	natiele@sflgrupo.com	\N	\N	t	VIP	2026-04-28 14:12:20.274	2026-04-28 14:12:46.597	$2b$10$1qHbPr7UpgEs2zk/7dk4mu9uB0XsBBMBw49/2Q8RG63o4gbZ4Al7O	USER	00407216	\N	\N	\N	\N	+55329969485	35	BRL	2026-06-23 15:06:49.769+00	f	35.00	1	XCIPTV	SMART TV	Rio de Janeiro
785836e6-431b-4992-b1d1-10703a84152c	Caroline Cipolla 	carolinec@sflgrupo.com	\N	\N	t	VIP	2026-05-29 15:43:51.366	2026-05-29 15:43:51.366	$2b$10$FR2.P0UtN4OsCrgP2ydS5.6lxj5FMR5k/Ac.HFzUKvgGi6C/CO9tC	USER	26848437	\N	\N	\N	\N	+55 19 99917-0664	40	BRL	2026-06-28 15:43:51.363+00	f	40.00	1	Xcloud	SAMSUNG	Brasil
cmobya7nd0001jw7g44c7i6uo	Usuário Teste	teste@teste.com	\N	\N	f	PREMIUM	2026-04-23 20:44:57.529	2026-05-27 09:00:16.107	$2b$10$M2YfDYIaAdOteKwKnXQ04eRCG.SGCAu3frmZz8eaXBq1XVUr3blQm	USER	teste	\N	\N	\N	\N	+351964300708	\N	BRL	2026-05-26 11:31:48.904+00	f	0.00	1	SFL Stream	SMART TV	Brasil
c54ede40-a4d0-4a7b-9e48-35b67ec154b3	Katia Cipolla Rio de Janeiro	katiacipolla@sflgrupo.com	\N	\N	t	VIP	2026-04-28 13:08:23.056	2026-04-28 13:09:19.007	$2b$10$HZoeKHfIzsEdtEygVuNSv.B/J2kzJEfhvO/LGyMncZb2e7SE8Ttba	USER	99375185	\N	\N	\N	\N	+5519997444248	40	BRL	2026-06-23 15:06:01.035+00	f	40.00	1	XCIPTV	SAMSUNG	Brasil
b3f39218-9cf1-4268-b34f-524f45a6b2b3	Antonio Carlos	antoniocarlos@sflgrupo.com	\N	\N	t	VIP	2026-04-28 13:12:43.431	2026-04-28 13:13:09.175	$2b$10$JB0R9OZ8HcrsOtuJ02QuYuiUTskLglDfZtave3V4xV45TYPTaQ6vm	USER	03antC	\N	\N	\N	\N	+5577981568105	40	BRL	2026-05-10 00:00:00+00	t	40.00	1	Ruko	SMART TV	Vitoria da Conquista
6087c4b3-7140-4c86-9062-207cc6d71c25	Rodolfo Esposa	rodolfoesposa@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 13:23:27.668	2026-04-28 13:23:52.166	$2b$10$dhaUwl7QlgbKrCn/NepDQOR1BdqtaM7Jk59CnL12AkSMf.k2Jpq4m	USER	82075017	\N	\N	\N	\N	+351913378971	9	EUR	2026-06-23 15:06:17.06+00	f	9.00	1	IosWebs	LG	Portugal
b32940b2-dcce-49a3-a0d8-41950e5639fe	Natiele Rio de Janeiro	natielerio@sflgrupo.com	\N	\N	t	VIP	2026-04-28 13:38:04.123	2026-04-28 14:10:52.893	$2b$10$SyDMTjWwz34GJsTUW5ojmu43nGDLCnF2fNcbrHiIR5.EpQ/QbHBoa	USER	81629858	\N	\N	\N	\N	+553299619485	35	BRL	2026-06-23 15:06:23.423+00	f	35.00	1	XCIPTV	SMART TV	Rio de Janeiro
1169a0e5-30a3-41c8-ba03-d0609aeeeecd	Robson Marciel Portugal	robsonmarciel@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:44:12.28	2026-04-28 14:44:31.908	$2b$10$nnh5CC.FI1sVvu7tZzmg2.FAENYHrY.3kcaB7/3du6IOv3VwF6YFG	USER	qqdf5t	\N	\N	\N	\N	+351937417132	9	EUR	2026-06-23 15:07:16.706+00	f	9.00	1	SFL Unitv	ANDROID TV	Portugal
d998810e-5552-4b34-83f4-e6a5b312ff0c	Roberta Matos Portugal	roberta@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:36:56.622	2026-04-28 14:37:26.348	$2b$10$E9fWODxEvQdRK6nVbsG3FuzbfnVQiq1PLCvgpVVx4WibtU6u1/gxC	USER	v4gk5n	\N	\N	\N	\N	+351933133301	9	EUR	2026-06-23 15:07:04.086+00	f	9.00	1	SFL Unitv	ANDROID TV	Portugal
cmobya7cg0000jw7g9nav9md8	SFL Admin	brasilviptv@gmail.com	\N	\N	t	PREMIUM	2026-04-23 20:44:57.136	2026-04-28 14:19:55.045	$2b$10$dQUzceKCEvhcKS7fJZHrS.GI/0F1LiEIcJR4RDzD.9M4yiIbSKbh6	ADMIN	Admin	\N	\N	\N	\N	+351928485483	\N	BRL	2026-05-26 11:16:25.757724+00	f	10.00	1	SFL Stream	SMART TV	Brasil
80fe2d04-4ce8-48f3-912d-eafe060f30c5	Daniel Matos Portugal	danielmatos@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:40:26.604	2026-04-28 14:41:01.156	$2b$10$Rouh8chXhj0IKxNJInq8CexVaDZmpvzkr11R0n3F3qOs2nNkT0Xza	USER	h3jr7y	\N	\N	\N	\N	+35933133297	9	EUR	2026-06-23 15:07:09.679+00	f	9.00	1	SFL Unitv	ANDROID TV	POrtugal
64088e3b-2583-4453-a4ef-4049f86cfd7c	Rubens Portugal	rubensportugal@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:50:29.564	2026-04-28 14:50:49.276	$2b$10$agStd30qz9Q1yN37L7UWpup4ImgkFk0MCQgY6iZD0nlLNbXZigCau	USER	mbx52u	\N	\N	\N	\N	+351939536661	9	EUR	2026-06-23 15:07:23.557+00	f	9.00	1	SFL UNITV	ANDROID TV	Portugal
a47f766f-bc21-4d7b-ba7a-8dc176481af4	Marcondes (Lobo)	lobo@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:54:14.925	2026-04-28 14:54:35.1	$2b$10$aFufHHj0kvhCgZzxCK75eePEGQucpAikhQdb9vxRfE6nWP0bSfXFG	USER	2yhey2	\N	\N	\N	\N	+351925524554	9	EUR	2026-06-23 15:07:39.82+00	f	9.00	1	SFL Unitv	TV BOX	Portugal
589b2e8e-b12d-42ba-9c8d-24ac1f4a1e9a	João Daniel Cipolla	danielcipolla@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 14:47:16.234	2026-04-28 14:47:55.412	$2b$10$3JqxlwlLMHonRpA.7sMpIO9a7YKpfCvvwoFQjex0SMcIvgQvL0ehq	USER	uknn35	\N	\N	\N	\N	+351913725187	9	EUR	2026-06-23 15:07:32.47+00	f	9.00	1	SFL Unitv	ANDROID TV	Portugal
f9ca548e-d11a-48d7-9891-fe9211bab3d3	Kaka	kaka@sflgrupo.com	\N	\N	t	VIP	2026-04-28 14:56:03.789	2026-04-28 14:56:17.252	$2b$10$L7liur8l03DnsOUgMc/Qd.6ZoWmpSx6F4a8x06aUaJbVvxgpfyxTG	USER	2yjn6h	\N	\N	\N	\N	+5577991396846	40	BRL	2026-06-23 15:07:41.835+00	f	40.00	1	SFL Unitv	TV BOX	Vitoria da Conquista
b8a1ad67-6405-4e0a-91a6-5d4c4fa33a04	Luis Carlos Carvalho	carvalho.c.c@hotmail.com	\N	\N	t	VIP	2026-04-26 12:20:48.378	2026-04-26 12:21:08.903	$2b$10$vPYzNVfO55xONWwRKh8RXOADI4f7p238vXRJSVvuFGpoiB8po4/ze	USER	admin	\N	\N	\N	\N	+5577998092910	40	BRL	2026-06-26 08:59:21.873+00	f	40.00	1	IMplayer	ANDROID TV	Brasil
945679f9-8973-4199-99b5-09fbe92aa716	Luana Souza Portugal	luanaportugal@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 19:55:00.815	2026-04-28 20:01:00.066	$2b$10$L4McKXg54s5ip2JGCNgN7OMuCiRdtBftXHCkpor9ouvK3Ka5Bn7Iy	USER	76jxtq	\N	\N	\N	\N	+351924357627	9	EUR	2026-05-28 19:55:00.815+00	t	9.00	1	SFL unitv	ANDROID TV	Portugal
77ba26b8-cf18-460c-ae09-de8782626ba5	Luana Souza Portugal	luanasouzapt@sflgrupo.com	\N	\N	t	PREMIUM	2026-04-28 20:05:27.771	2026-04-28 20:06:11.898	$2b$10$KjVwED527O/db3pewgL3jujpDJuL7DJaTSq3S1PlU2u2o4glmgZ.K	USER	77033576	\N	\N	\N	\N	+351924357627	8	EUR	2026-05-28 20:05:27.771+00	t	8.00	1	Ultra Player	LG	Portugal
3f66ac95-279c-43c4-b5c3-1587bdb5a3b8	Andreia Rio	andreia@sflgrupo.com	\N	\N	t	VIP	2026-05-24 15:04:38.523	2026-05-24 15:04:38.523	$2b$10$CH2YplK3hfskeChlu2BMqOPJjq1ARYLUbXDl5bbAn8qzqJH7c57JK	USER	995327183	\N	\N	\N	\N	+5519995327183	40	BRL	2026-06-23 15:04:38.514+00	f	40.00	1	Xcloud 	LG	
365aae08-46db-4f8a-a08e-38091c55673d	Barbosa	barbosa@sflgrupo.com	\N	\N	t	VIP	2026-04-28 14:18:49.602	2026-04-28 14:19:05.493	$2b$10$Q9msK9DOYUSGXDKKoJGaLeA7oxTXEvHeT2ym6Xjeh0E5XIy67qsbW	USER	barb2025	\N	\N	\N	\N	+5577991363374	40	BRL	2026-06-23 15:06:58.256+00	f	40.00	1	XCIPTV	TV BOX	Vitoria da Conquista
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Movie" (id, title, description, "thumbnailUrl", "videoUrl", duration, category, genre, rating, year, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: Watchlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Watchlist" (id, "userId", "mediaId", title, "posterPath", type, metadata) FROM stdin;
cb6bb9dd-983f-4bd6-8e18-c973dbb1d957	d998810e-5552-4b34-83f4-e6a5b312ff0c	936075	Michael	https://image.tmdb.org/t/p/w500/dueFqKLvjftnELZaGYwY7xinfaI.jpg	movie	Destaque SFL
\.


--
-- Data for Name: _MovieToCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_MovieToCategory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1db1ac61-bd59-47f7-9648-6994fd73d558	a43b1bb9ca0f75c0cf8a08313a15c73205e898d14504155738e7d8baa1960c03	2026-04-22 19:17:02.261177+00	20260422191701_init_sfl_stream	\N	\N	2026-04-22 19:17:01.231939+00	1
\.


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, user_id, type, days_remaining, sent_at) FROM stdin;
\.


--
-- Data for Name: available_apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.available_apps (id, name, platform, icon_url, download_url, description, created_at, updated_at) FROM stdin;
7192eb68-381c-4bcc-b8cf-48b384276586	SFL miTV	ANDROID	https://i.imgur.com/6zrOU61.png	https://implayer.tv/d	O SFL miTV é estritamente um 'Reprodutor de Mídia' e deve ser usado apenas com conteúdo criado pelo próprio usuário ou adquirido legalmente!	2026-04-28 16:03:52.696064+00	2026-04-28 16:03:52.696064+00
6d3dd25a-d04d-40f0-8f82-0778c6fe7950	SFL Ultra Player	ANDROID	https://i.imgur.com/oYHxic1.png	https://dl.ntdev.in/36316	O Ultra Player é um reprodutor de mídia moderno, rápido e fácil de usar, desenvolvido para oferecer a melhor experiência na reprodução dos seus conteúdos.	2026-04-28 16:16:30.378649+00	2026-04-28 16:16:30.378649+00
88c0a4d3-3b5e-4ccb-bca8-313363897e3b	SFL Fenix Lite	ANDROID	https://i.imgur.com/foo2oe8.png	http://dl.ntdev.in/47398	Fenix Play, que serve como um reprodutor de listas de canais no formato IPTV. Ele é compatível com dispositivos como a TV Roku ou o aparelhinho Roku Express. É fundamental entender como ele funciona, especialmente para quem está começando a navegar no mundo do IPTV.	2026-04-28 16:19:12.233653+00	2026-04-28 16:19:12.233653+00
9f99893b-e524-4127-94b0-e056c06eb026	SFL UNI - Mobile	ANDROID	https://i.imgur.com/5U3CYsg.jpeg	http://mkdw.qrdldunitvss.com/download	O SFL UNI é estritamente um 'Reprodutor de Mídia' e deve ser usado apenas com conteúdo criado pelo próprio usuário desenvolvido para Mobile	2026-04-28 16:39:49.406593+00	2026-04-28 16:39:49.406593+00
d29d434e-5b57-4684-b954-5d5a732ec173	SFL UNITV	ANDROID	https://i.imgur.com/Ox23f8K.jpeg	https://links.fileload.one/NPWN	O SFL UNI é estritamente um 'Reprodutor de Mídia' e deve ser usado apenas com conteúdo criado pelo próprio usuário, App desenvolvido para Android TV	2026-04-28 16:44:14.546983+00	2026-04-28 16:44:14.546983+00
89e8f156-569e-46ce-99a7-85d21b2bed40	SFL DNS	ANDROID	https://i.imgur.com/jNuqUyC.jpeg	https://dl.ntdev.in/19182	O SFL DNS é uma solução prática e eficiente desenvolvida para desbloquear conteúdos restritos através de DNS. Com ele, é possível contornar limitações geográficas e de rede, permitindo o acesso a websites, serviços e plataformas que normalmente estariam bloqueados.	2026-04-28 16:56:23.284556+00	2026-04-28 16:56:23.284556+00
e4602e8c-7fb7-4faa-98fb-f62a418cbeb2	ntDown	ANDROID	https://i.imgur.com/gp1XhD7.png	https://play.google.com/store/apps/details?id=link.ntdev.ntdw&hl=pt_PT	A segurança começa por compreender como os programadores recolhem e partilham os seus dados. As práticas de privacidade e segurança dos dados podem variar consoante a sua utilização, região e idade. O programador fornece estas informações e pode atualizá-las ao longo do tempo.	2026-04-28 17:00:35.197597+00	2026-04-28 17:00:35.197597+00
31b3a722-1fda-4329-a15f-2cce9fbb6156	Downloader (Android)	ANDROID	https://i.imgur.com/qF7g1kN.png	https://play.google.com/store/apps/details?id=com.tech.downloader&hl=pt_PT	Apresentamos nosso novo aplicativo Downloader para recuperar vários tipos de arquivos digitais da internet. Com nossa interface amigável, você pode baixar facilmente os arquivos desejados copiando e colando o URL do arquivo ou utilizando o plug-in do navegador para navegar e baixar arquivos diretamente de sites.	2026-04-28 17:02:38.855879+00	2026-04-28 17:02:38.855879+00
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plans (id, user_id, plan_name, activated_at, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: pricing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_plans (id, name, price, currency, features, button_text, is_popular, color_theme) FROM stdin;
f589203a-899e-49cd-8692-2d1100791fe0	💼 SaaS de Gestão de Clientes	30,00	EUR	{"✔️ Gestão automatizada de clientes","✔️ Cobranças automáticas","✔️ Avisos de vencimento inteligentes","✔️ Relatórios de lucro por servidor","✔️ Gestão completa de assinaturas","✔️ Controle de créditos simplificado","✔️ Dashboard completo e intuitivo","","👉 Organize, automatize e escale o seu negócio hoje mesmo!"}	ASSINAR STANDARD	f	green
07c11cd4-5aad-4b5e-93b0-264e26c40b1f	plano sfl semestral	48,00	EUR	{"✔️ 1 dispositivo incluído","✔️ Canais de TV ao vivo","✔️ Filmes e séries atualizados","✔️ Conteúdo desportivo (Sports)","✔️ Qualidade 4K / Full HD","✔️ Guia de programação (EPG)","✔️ Streaming global","✔️ Atualizações automáticas","✔️ Aplicações oficiais","✔️ Vpn dedicada (android, Ios)","✔️ Suporte 24/7/365","","👉 Ative agora e comece a assistir em minutos!"}	ASSINAR BASIC	f	blue
23e6e0df-b2f8-42ef-b04b-81ac8cf855e5	📺 Plano SFL miTV VIP (Mês)	9,00	EUR	{"✔️ 1 dispositivo incluído","✔️ Canais de TV ao vivo","✔️ Filmes e séries atualizados","✔️ Conteúdo desportivo (Sports)","✔️ Qualidade 4K / Full HD","✔️ Guia de programação (EPG)","✔️ Streaming global","✔️ Atualizações automáticas","✔️ Aplicações oficiais","✔️ Suporte 24/7/365","","👉 Ative agora e comece a assistir em minutos!"}	ASSINAR PREMIUM	t	yellow
\.


--
-- Data for Name: recent_catalog_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recent_catalog_updates (id, raw_text, parsed_titles, updated_at) FROM stdin;
af7b8b95-306f-4c13-83af-b6b4df382306	- Exemplo Filme (2025)	{"Exemplo Filme"}	2026-04-28 17:43:49.420551+00
\.


--
-- Data for Name: recent_uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recent_uploads (id, tmdb_id, title, poster_path, type, release_date, created_at) FROM stdin;
\.


--
-- Data for Name: site_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_features (id, title, description, icon_name, color_theme) FROM stdin;
279ea1f8-652b-4434-b7e6-b627dd1341ed	📺 Assista na sua TV	Compatível com Smart TVs, Android TV, Apple TV, TV Box, Roku TV, Chromecast e muito mais .\ntudo diretamente do conforto do seu sofá.\n\n✔️ Funciona com todas as principais marcas de Smart TV\n\n👉 Conecte e comece a assistir em minutos!	Tv	green
589e3ba4-00ad-4092-b7cb-a889dcdf10e0	📱 Assista no seu celular	Compatível com Android e iPhone,  leve seus conteúdos favoritos para onde quiser.\n\n✔️ Assista em qualquer lugar\n✔️ Qualidade HD / Full HD\n✔️ Acesso rápido e fácil\n✔️ Funciona em redes Wi-Fi e dados móveis\n\n👉 Baixe, acesse e comece a assistir agora!	Smartphone	yellow
437c6f2f-b18d-4006-964b-4b45cf600282	🔒 Segurança total	Sua conta protegida com tecnologia avançada para garantir privacidade e tranquilidade.\n\n✔️ Dados protegidos e criptografados\n✔️ Acesso seguro em qualquer dispositivo\n✔️ Vpn dedicada (Android e IOS)\n✔️ Privacidade garantida\n\n👉 Use com confiança e total segurança!	ShieldCheck	green
67174bb0-2c82-448c-8e6d-f6068012c05e	🌍 Assista em qualquer lugar	Acesse sua conta em computadores, tablets e consoles de videogame com total liberdade.\n\n✔️ Compatível com múltiplos dispositivos\n✔️ Acesso rápido e seguro\n✔️ Continue assistindo de onde parou\n✔️ Perfeito para casa ou em viagem\n\n👉 Entre na sua conta e leve seu conteúdo com você!	Globe	blue
\.


--
-- Data for Name: support_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_requests (id, user_id, service_type, description, status, created_at, updated_at, admin_response, messages) FROM stdin;
271a81d1-7065-43b5-a947-b6592f001d48	cmobya7nd0001jw7g44c7i6uo	Pedido de Filme	continuar teste	FINISHED	2026-04-26 11:05:11.273842+00	2026-04-26 11:10:36.889+00	testete sgshhs 	[{"date": "2026-04-26T11:05:11.273842+00:00", "role": "user", "text": "vanmos testa o suporte"}, {"date": "2026-04-26T11:09:35.251Z", "role": "admin", "text": "vamos testa"}, {"date": "2026-04-26T11:09:58.670Z", "role": "user", "text": "continuar teste"}, {"date": "2026-04-26T11:10:23.516Z", "role": "admin", "text": "testete sgshhs "}]
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, user_id, movie_id, issue_type, status, created_at, closed_at) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (id, key, value, updated_at) FROM stdin;
9ae4a527-ecd0-4bd4-b1e1-919b86ec572f	epg_url	https://epg.pw/xmltv/epg_BR.xml.gz	2026-04-29 21:04:11.762444+00
\.


--
-- Data for Name: trailer_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trailer_overrides (movie_id, manual_url, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, type, category, amount, description, user_id, created_at, currency) FROM stdin;
abc6df83-14de-443a-b6be-86cfbdf62914	EXPENSE	CREDITS	120.00	Creditos dna go	\N	2026-04-26 12:21:47.038634+00	BRL
e457ce04-169f-4717-9e22-309a2ab0eb84	EXPENSE	CREDITS	100.00	Recarga UNITV	\N	2026-04-28 14:57:35.229018+00	BRL
439040d1-a412-4076-980e-e09b00ab63e6	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: carvalho.c.c@hotmail.com	b8a1ad67-6405-4e0a-91a6-5d4c4fa33a04	2026-04-26 12:20:49.456045+00	BRL
528b457e-4f08-471b-ae96-bd5e26d40a96	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: katiacipolla@sflgrupo.com	c54ede40-a4d0-4a7b-9e48-35b67ec154b3	2026-04-28 13:08:23.906874+00	BRL
c2c3fec1-9d20-43e3-91e0-4ff639e5a613	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: antoniocarlos@sflgrupo.com	b3f39218-9cf1-4268-b34f-524f45a6b2b3	2026-04-28 13:12:44.086629+00	BRL
d6486d38-2164-4e21-85c3-dcbbc06f7b18	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: rodofoirmao@sflgrupo.com	4dba3328-d21f-4915-bd53-2517dc0e0e85	2026-04-28 13:17:33.463248+00	EUR
88428db6-fe1f-454a-8705-2bc7bc6e8b55	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: rodolfoesposa@sflgrupo.com	6087c4b3-7140-4c86-9062-207cc6d71c25	2026-04-28 13:23:28.25903+00	EUR
30bd3a75-93c4-49df-9a10-5378d7c84a72	INCOME	PLAN_RENEWAL	35.00	Primeiro pagamento: natielerio@sflgrupo.com	b32940b2-dcce-49a3-a0d8-41950e5639fe	2026-04-28 13:38:04.712451+00	BRL
a423a28c-eb59-43bb-b3c1-b81a354e9577	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: eroksonportugal@sflgrupo.com	4e817e55-7cb4-49f7-848a-b398de2bf151	2026-04-28 13:51:36.137808+00	EUR
3c6c554a-ef55-4d4a-9e32-bda49a8e3295	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: matheus01@sflgrupo.com	3df113a3-ad95-4c37-bcc2-fdf4d532b756	2026-04-28 14:00:03.722244+00	EUR
33b04b15-62d5-44c7-b22d-28d2f99526ce	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: matheus02@sflgrupo.com	1ebae11a-e2f2-477b-aeca-d3edd7b460dd	2026-04-28 14:03:34.039854+00	EUR
cf050ef8-f468-4bf3-b0f0-ca1c117ddd3b	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: davidportugal@sflgrupo.com	1f0b5544-d04a-46bd-b7a9-be6df3bb5c77	2026-04-28 14:07:41.035278+00	EUR
17b03dea-5898-4d7e-bbd5-8722de65abee	INCOME	PLAN_RENEWAL	35.00	Primeiro pagamento: natiele@sflgrupo.com	10912abf-7339-4845-a0a6-55f58e25006e	2026-04-28 14:12:20.989875+00	BRL
b25a9e7f-a045-4f14-9099-480335737986	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: murilo@sflgrupo.com	aa74fabb-3449-4545-bfbf-62cb3e3bd00f	2026-04-28 14:15:29.641288+00	BRL
859302b4-1ad8-43c5-9156-a35f7b29895c	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: barbosa@sflgrupo.com	365aae08-46db-4f8a-a08e-38091c55673d	2026-04-28 14:18:50.263525+00	BRL
c45b8200-ac77-4b45-9b41-2c52a6f3e5b0	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: roberta@sflgrupo.com	d998810e-5552-4b34-83f4-e6a5b312ff0c	2026-04-28 14:36:57.172491+00	EUR
27c515e8-27fa-461f-976e-e020cbaece9b	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: danielmatos@sflgrupo.com	80fe2d04-4ce8-48f3-912d-eafe060f30c5	2026-04-28 14:40:27.344664+00	EUR
0a60ffaa-633e-4a86-bbd9-5fde504598c7	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: robsonmarciel@sflgrupo.com	1169a0e5-30a3-41c8-ba03-d0609aeeeecd	2026-04-28 14:44:13.059873+00	EUR
fc672a6b-32ca-4898-939f-bb874e483758	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: danielcipolla@sflgrupo.com	589b2e8e-b12d-42ba-9c8d-24ac1f4a1e9a	2026-04-28 14:47:16.826911+00	EUR
9f2b5555-1ca8-4ac2-9d32-9a8c6af1cd0c	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: rubensportugal@sflgrupo.com	64088e3b-2583-4453-a4ef-4049f86cfd7c	2026-04-28 14:50:30.251621+00	EUR
6bb7d46f-b34c-493a-a068-d355ba2bf8e8	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: lobo@sflgrupo.com	a47f766f-bc21-4d7b-ba7a-8dc176481af4	2026-04-28 14:54:15.591824+00	EUR
8323c844-53b9-4f35-9fbc-82f24295e7b6	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: kaka@sflgrupo.com	f9ca548e-d11a-48d7-9891-fe9211bab3d3	2026-04-28 14:56:04.350229+00	BRL
45ba69a5-48c6-4d78-aefa-1840d155838e	INCOME	PLAN_RENEWAL	9.00	Primeiro pagamento: luanaportugal@sflgrupo.com	945679f9-8973-4199-99b5-09fbe92aa716	2026-04-28 19:55:01.818974+00	BRL
17bb8418-87bb-4ba2-a041-b372ed98a711	INCOME	PLAN_RENEWAL	8.00	Primeiro pagamento: luanasouzapt@sflgrupo.com	77ba26b8-cf18-460c-ae09-de8782626ba5	2026-04-28 20:05:28.707971+00	BRL
2d6512f7-f852-4a84-ace4-6773feedf152	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: andreia@sflgrupo.com	3f66ac95-279c-43c4-b5c3-1587bdb5a3b8	2026-05-24 15:04:39.358855+00	BRL
8b65b367-ce3b-40a1-b838-6b354e306c13	INCOME	PLAN_RENEWAL	40.00	Renovação: katiacipolla@sflgrupo.com	c54ede40-a4d0-4a7b-9e48-35b67ec154b3	2026-05-24 15:06:01.259754+00	BRL
f8d07265-399d-439d-8322-1f29d770e849	INCOME	PLAN_RENEWAL	9.00	Renovação: rodofoirmao@sflgrupo.com	4dba3328-d21f-4915-bd53-2517dc0e0e85	2026-05-24 15:06:11.183432+00	BRL
4a4c6803-29b2-41d4-905b-c56745c1b415	INCOME	PLAN_RENEWAL	9.00	Renovação: rodolfoesposa@sflgrupo.com	6087c4b3-7140-4c86-9062-207cc6d71c25	2026-05-24 15:06:17.324142+00	BRL
798a2676-f53e-4363-a09e-3528733e30f6	INCOME	PLAN_RENEWAL	35.00	Renovação: natielerio@sflgrupo.com	b32940b2-dcce-49a3-a0d8-41950e5639fe	2026-05-24 15:06:23.677715+00	BRL
c9e49cb2-a1fe-4730-bcdb-28214fc2c2e5	INCOME	PLAN_RENEWAL	9.00	Renovação: eroksonportugal@sflgrupo.com	4e817e55-7cb4-49f7-848a-b398de2bf151	2026-05-24 15:06:28.636531+00	BRL
8151237d-b5a4-4589-a42e-535a4e388bf4	INCOME	PLAN_RENEWAL	9.00	Renovação: matheus01@sflgrupo.com	3df113a3-ad95-4c37-bcc2-fdf4d532b756	2026-05-24 15:06:34.02151+00	BRL
e004514b-5c7f-47e8-be17-9dfe7e67b16f	INCOME	PLAN_RENEWAL	9.00	Renovação: davidportugal@sflgrupo.com	1f0b5544-d04a-46bd-b7a9-be6df3bb5c77	2026-05-24 15:06:45.847751+00	BRL
0256d5e0-6ecf-4812-a0ed-29f99272b416	INCOME	PLAN_RENEWAL	9.00	Renovação: matheus02@sflgrupo.com	1ebae11a-e2f2-477b-aeca-d3edd7b460dd	2026-05-24 15:06:39.054391+00	BRL
41014ef0-c35b-40a3-9cd4-485c86933b79	INCOME	PLAN_RENEWAL	35.00	Renovação: natiele@sflgrupo.com	10912abf-7339-4845-a0a6-55f58e25006e	2026-05-24 15:06:49.993715+00	BRL
bc45c741-1c7d-4880-b6f7-f5a8a25b81cf	INCOME	PLAN_RENEWAL	40.00	Renovação: murilo@sflgrupo.com	aa74fabb-3449-4545-bfbf-62cb3e3bd00f	2026-05-24 15:06:54.194343+00	BRL
e4e4929b-6464-405d-b7b9-5f046da232cb	INCOME	PLAN_RENEWAL	40.00	Renovação: barbosa@sflgrupo.com	365aae08-46db-4f8a-a08e-38091c55673d	2026-05-24 15:06:58.410576+00	BRL
7fdb1f96-6308-4131-a292-c760b685efc9	INCOME	PLAN_RENEWAL	9.00	Renovação: roberta@sflgrupo.com	d998810e-5552-4b34-83f4-e6a5b312ff0c	2026-05-24 15:07:04.27906+00	BRL
f5bca442-dcdd-445a-9e0f-43d4e5ac78bf	INCOME	PLAN_RENEWAL	9.00	Renovação: danielmatos@sflgrupo.com	80fe2d04-4ce8-48f3-912d-eafe060f30c5	2026-05-24 15:07:09.868069+00	BRL
8302d956-9e3f-4df6-83eb-d9d6b1a4bb9b	INCOME	PLAN_RENEWAL	9.00	Renovação: robsonmarciel@sflgrupo.com	1169a0e5-30a3-41c8-ba03-d0609aeeeecd	2026-05-24 15:07:16.986588+00	BRL
0decb3ea-0fed-4389-8acb-f1da39420436	INCOME	PLAN_RENEWAL	9.00	Renovação: rubensportugal@sflgrupo.com	64088e3b-2583-4453-a4ef-4049f86cfd7c	2026-05-24 15:07:23.780389+00	BRL
4325eaa7-c7da-4d42-a95f-cd5f8ed5966d	INCOME	PLAN_RENEWAL	9.00	Renovação: danielcipolla@sflgrupo.com	589b2e8e-b12d-42ba-9c8d-24ac1f4a1e9a	2026-05-24 15:07:32.698806+00	BRL
c7217014-a89b-40c4-9d85-af2a80ca9a7a	INCOME	PLAN_RENEWAL	9.00	Renovação: lobo@sflgrupo.com	a47f766f-bc21-4d7b-ba7a-8dc176481af4	2026-05-24 15:07:40.046271+00	BRL
3cb6cfe8-ba9a-4f94-aeaa-584c1159ac0d	INCOME	PLAN_RENEWAL	40.00	Renovação: kaka@sflgrupo.com	f9ca548e-d11a-48d7-9891-fe9211bab3d3	2026-05-24 15:07:42.006735+00	BRL
16a3c454-066d-4fc4-99a1-2fe89cfe5c12	INCOME	PLAN_RENEWAL	40.00	Renovação: carvalho.c.c@hotmail.com	b8a1ad67-6405-4e0a-91a6-5d4c4fa33a04	2026-05-27 08:59:22.706753+00	BRL
0a94b942-9c09-4d52-b964-f7fe4e149782	INCOME	PLAN_RENEWAL	40.00	Primeiro pagamento: carolinec@sflgrupo.com	785836e6-431b-4992-b1d1-10703a84152c	2026-05-29 15:43:51.444767+00	BRL
\.


--
-- Data for Name: tv_channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tv_channels (id, name, logo_url, stream_url, category, epg_channel_id, number, created_at) FROM stdin;
213c9dc5-5923-4e3f-97d1-37f9746f13f7	TELECINE ACTION SD¹	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	1	2026-06-11 19:56:16.196748+00
758fef50-fb60-43ae-8665-c9aa03e0a62c	RECORD NEWS HD+	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Abertos	Recordnews.br	2	2026-06-11 19:56:16.196748+00
e0a29dbe-37ed-47ab-9ab5-30c858ae4ccb	(+18) PLAYBOY TV SD¹	https://googleplusimages.com/PLAYBOYTV.png	https://example.com/stream.m3u8	Adulto	Playboytv.br	3	2026-06-11 19:56:16.196748+00
b66c5b63-1519-451f-b8e6-567192062360	TV BRASIL HD²	https://i.ibb.co/c8PhcZ1/d334NZ3.png	https://example.com/stream.m3u8	Geral	Tvbrasil.br	4	2026-06-11 19:56:16.196748+00
f89329d8-9506-41b9-bb79-a65a0362d1eb	DISCOVERY CHANNEL SD¹	https://googleplusimages.com/DISCOVERYCHANNEL.png	https://example.com/stream.m3u8	Documentários	Discovery.br	5	2026-06-11 19:56:16.196748+00
b75fe922-5ed7-4197-90cb-de889051cd59	CARTOON NETWORK HD²	https://googleplusimages.com/CARTOONNETWORK.png	https://example.com/stream.m3u8	Infantil	Cartoonnetwork.br	6	2026-06-11 19:56:16.196748+00
3f9daa39-e557-4244-be95-967d817334ce	GLOBOPLAY NOVELAS HD²	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	7	2026-06-11 19:56:16.196748+00
1cb78177-0703-4518-9f41-206af6af0a50	UNIVERSAL TV HD²	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	8	2026-06-11 19:56:16.196748+00
76d4af01-62d6-42c6-9c2e-2dc7633150d2	TNT SÉRIES HD²	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	9	2026-06-11 19:56:16.196748+00
9d9d0e57-1842-447b-8c7f-13cd2ba96e77	TNT HD²	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	10	2026-06-11 19:56:16.196748+00
7b993f9e-a609-47b6-944d-ea16a4e0011a	TELECINE TOUCH HD²	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	11	2026-06-11 19:56:16.196748+00
71eaa1b3-129e-44e9-a0c2-6e8f37b2a52a	TELECINE PREMIUM HD²	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	12	2026-06-11 19:56:16.196748+00
33e068e8-9bef-4f91-8fe5-263ecb7d7156	TELECINE PIPOCA HD²	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	13	2026-06-11 19:56:16.196748+00
57bb31ee-09fe-430f-8e56-d72708c66bc7	TELECINE FUN HD²	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	14	2026-06-11 19:56:16.196748+00
f052cbde-9010-46b3-ad6e-c5d452c33fa3	TELECINE ACTION HD¹	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	15	2026-06-11 19:56:16.196748+00
fb89ce46-bd0a-4e1b-8d93-684229374b0e	TNT NOVELAS HD²	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	16	2026-06-11 19:56:16.196748+00
332726ce-babb-4844-b977-e8e1db5398f8	SPORTV HD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	17	2026-06-11 19:56:16.196748+00
63c6a79d-8f38-49ac-a09c-83c355e61d2b	SPORTV 3 HD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	18	2026-06-11 19:56:16.196748+00
a8b42cb7-5411-43b4-95a1-e0c80286242d	SPORTV 2 HD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	19	2026-06-11 19:56:16.196748+00
641ff9ae-07c5-40b3-be3a-47de7edcb717	SPACE HD²	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	20	2026-06-11 19:56:16.196748+00
1d923e37-13ab-483f-ab27-631508b1c7a6	SBT SP HD²	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	21	2026-06-11 19:56:16.196748+00
745f19db-940b-4175-902a-a6d30bfb179a	REDETV! SP HD²	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Abertos	Redetv.br	22	2026-06-11 19:56:16.196748+00
965dd282-d8bd-44ec-89bb-634ef6b3c3b5	RECORD SP HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	23	2026-06-11 19:56:16.196748+00
a68cba35-b59a-4acd-9c43-6a927a9e2d79	PREMIERE 5 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere5.br	24	2026-06-11 19:56:16.196748+00
eaea58b4-d64e-4365-88a9-6d34a88c7db0	PREMIERE 4 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere4.br	25	2026-06-11 19:56:16.196748+00
ba0fc25c-212d-4051-a4f0-6bbaf37da492	PREMIERE 3 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere3.br	26	2026-06-11 19:56:16.196748+00
dd26f78a-0d2b-4d4a-b5eb-604041c5eb3d	PREMIERE 2 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	27	2026-06-11 19:56:16.196748+00
fca6c069-63fb-4967-9709-3391cb81e9c6	PREMIERE CLUBES HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	28	2026-06-11 19:56:16.196748+00
6fb6e7a6-da1f-4136-a025-2ccb13e4f358	CANAL OFF HD²	https://googleplusimages.com/CANALOFF.png	https://example.com/stream.m3u8	Documentários	Off.br	29	2026-06-11 19:56:16.196748+00
de1accf1-c33a-4e48-b594-513b866405f5	MULTISHOW HD²	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	30	2026-06-11 19:56:16.196748+00
69a143a0-0e95-4ec6-9650-ebd9f67a3882	MEGAPIX HD²	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	31	2026-06-11 19:56:16.196748+00
085271cf-6f8f-4f27-8bb8-2751ed89b5f2	INVESTIGAÇÃO DISCOVERY HD²	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	32	2026-06-11 19:56:16.196748+00
90fbd35a-1baf-4df0-aa13-9f4f39cb22f5	HISTORY HD²	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	33	2026-06-11 19:56:16.196748+00
f7bb7ded-8d5c-4f57-a61e-94f0669554bf	HBO SIGNATURE HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	34	2026-06-11 19:56:16.196748+00
635daba9-c847-428f-bce5-9b02c48e442c	HBO + HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	35	2026-06-11 19:56:16.196748+00
a65be98f-e02d-42e2-ba0c-6db9939c25c8	HBO HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	36	2026-06-11 19:56:16.196748+00
1a34acaa-0c46-4cf7-a174-b29a04fcd90b	HBO FAMILY HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	37	2026-06-11 19:56:16.196748+00
7e4e94fc-8cc3-4688-9338-75d753a01a04	HBO 2 HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	38	2026-06-11 19:56:16.196748+00
d4fba82a-9fc3-42df-9ae3-13145d207e12	HISTORY 2 HD²	https://i.imgur.com/JOmLdYI.png	https://example.com/stream.m3u8	Documentários	History2.br	39	2026-06-11 19:56:16.196748+00
6ac64c7e-ab81-4ced-bc4d-262e1317f710	GNT HD²	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	40	2026-06-11 19:56:16.196748+00
b7994b80-6bf1-4dbb-979d-48b8183a02bc	GLOBO RIO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	41	2026-06-11 19:56:16.196748+00
24a68bbb-7170-47a9-a1a2-2c9d179d9764	ESPN5 HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	42	2026-06-11 19:56:16.196748+00
1a298938-e4d0-41dc-981f-cb1b250a6d70	ESPN4 HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	43	2026-06-11 19:56:16.196748+00
c299ce5b-3e21-4bb5-9479-c2ae0f178fe0	ESPN2 HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	44	2026-06-11 19:56:16.196748+00
f804678c-17c9-4910-a648-4b0da3d09668	ESPN HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	45	2026-06-11 19:56:16.196748+00
67c4a8cc-8db7-4268-93e7-e5a77c4acde5	ESPN3 SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	46	2026-06-11 19:56:16.196748+00
9cf66bbf-f728-4212-a88d-14bd329bdfbe	SPORTV 3 HD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	93	2026-06-11 19:56:16.196748+00
64f6829f-b58c-490b-a224-7d4c5055d101	DISCOVERY WORLD HD²	https://googleplusimages.com/DISCOVERYWORLD.png	https://example.com/stream.m3u8	Documentários	Discworld.br	47	2026-06-11 19:56:16.196748+00
106088a1-ca72-431f-9398-467e26fb9d32	DISCOVERY TURBO HD²	https://googleplusimages.com/DISCOVERYTURBO.png	https://example.com/stream.m3u8	Documentários	Discturbo.br	48	2026-06-11 19:56:16.196748+00
6cca57fb-ccec-4e33-b972-0257bb330d6e	DISCOVERY THEATER HD¹	https://googleplusimages.com/DISCOVERYTHEATER.png	https://example.com/stream.m3u8	Documentários	Disctheater.br	49	2026-06-11 19:56:16.196748+00
0b2837f7-62d9-4ded-9395-4054c83bf155	DISCOVERY HOME & HEALTH HD²	https://googleplusimages.com/DISCOVERYHOME&HEALTH.png	https://example.com/stream.m3u8	Documentários	Discoveryhomehealth.br	50	2026-06-11 19:56:16.196748+00
3ee25e07-c1d6-45ee-8fc1-d503f1f072d9	DISCOVERY CHANNEL HD²	https://googleplusimages.com/DISCOVERYCHANNEL.png	https://example.com/stream.m3u8	Documentários	Discovery.br	51	2026-06-11 19:56:16.196748+00
fe4a5c7b-6237-49da-a8b0-501fbd304094	SONY CHANNEL HD²	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	52	2026-06-11 19:56:16.196748+00
f72643f9-3dd0-42e8-8d76-f693c97b9f21	BIS HD²	https://googleplusimages.com/BIS.png	https://example.com/stream.m3u8	Variedades/Música	Bis.br	53	2026-06-11 19:56:16.196748+00
a53e7744-57cd-4e7c-9a7a-9be309bb16a0	BANDSPORTS HD²	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	54	2026-06-11 19:56:16.196748+00
19526ffe-4b70-4ca2-89a1-e10d493995bf	BAND SP HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	55	2026-06-11 19:56:16.196748+00
343df610-bce4-4477-9d16-ec170b1cb6de	AXN HD²	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	56	2026-06-11 19:56:16.196748+00
def2c747-f835-48cd-88dc-d222dd0d614a	ANIMAL PLANET HD²	https://googleplusimages.com/ANIMALPLANET.png	https://example.com/stream.m3u8	Documentários	Animalplanet.br	57	2026-06-11 19:56:16.196748+00
89ee0119-5b8c-4be2-a4af-fbf16f73dcbf	RFTV HD+	https://i.imgur.com/g7NP85Z.png	https://example.com/stream.m3u8	Geral	Redefamilia.br	58	2026-06-11 19:56:16.196748+00
e077fd6e-09c0-46ed-843b-26b0d34b4be9	WARNER CHANNEL HD²	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	59	2026-06-11 19:56:16.196748+00
d1a1ab99-1cda-4e93-870c-90588ee64951	(+18) SEXPRIVÉ HD²	https://googleplusimages.com/SEXPRIVE.png	https://example.com/stream.m3u8	Adulto	Sexprive.br	60	2026-06-11 19:56:16.196748+00
66ba3bcb-de1a-419b-9c91-e378369110d7	GLOBO BRASÍLIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globodf.br	61	2026-06-11 19:56:16.196748+00
7439c81f-e761-4763-be70-b7979a4ad6ec	ESPN3 HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	62	2026-06-11 19:56:16.196748+00
e3eeab65-d897-4e15-ae9c-24abf4f715ef	EPTV CAMPINAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvmg.br	63	2026-06-11 19:56:16.196748+00
9cafe1df-06ac-4704-b0d6-170d4c03b529	TLC HD²	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	64	2026-06-11 19:56:16.196748+00
11f6566e-9cc1-4803-80ad-fb51562e22ac	TELECINE CULT HD²	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	65	2026-06-11 19:56:16.196748+00
9c865a4c-0abc-4003-94e6-160748ea02e8	USA NETWORK HD²	https://googleplusimages.com/USANETWORK.png	https://example.com/stream.m3u8	Geral	Usa.br	66	2026-06-11 19:56:16.196748+00
530f4233-a3dc-4830-a8fa-82df1b9980c0	STUDIO UNIVERSAL HD²	https://googleplusimages.com/STUDIOUNIVERSAL.png	https://example.com/stream.m3u8	Filmes/Séries	Studiouniversal.br	67	2026-06-11 19:56:16.196748+00
b2cb2822-c279-466c-9bd0-f93cb5544af7	HBO POP HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	68	2026-06-11 19:56:16.196748+00
f61502d0-012a-4968-994b-e9c108eefe47	HBO XTREME HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	69	2026-06-11 19:56:16.196748+00
54e52a97-6695-4647-947b-28c933bf00de	HBO MUNDI HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	70	2026-06-11 19:56:16.196748+00
01aa01c4-d5ed-4d32-8450-39cd9923fbc4	LIFETIME HD²	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	71	2026-06-11 19:56:16.196748+00
e2e43393-9100-4504-bd0d-a39501b3cf6f	GLOOB HD²	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	72	2026-06-11 19:56:16.196748+00
91b625fb-9d35-4485-8ebc-0c050d30cc5b	MODO VIAGEM HD²	https://googleplusimages.com/MODOVIAGEM.png	https://example.com/stream.m3u8	Geral	Modoviagem.br	73	2026-06-11 19:56:16.196748+00
c75a9081-1e43-43c9-b4cd-b592108d9187	GLOBO SP HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	74	2026-06-11 19:56:16.196748+00
4d1e48fc-b57b-45ee-bae9-995545321a6d	GLOBO NORDESTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	75	2026-06-11 19:56:16.196748+00
d0291c80-55cf-4268-87de-009909b5aa27	GLOBONEWS HD²	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	76	2026-06-11 19:56:16.196748+00
1d4477b8-bb9d-4383-b4a7-79fde97709b2	FOOD NETWORK HD²	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	77	2026-06-11 19:56:16.196748+00
cf8bf771-4c49-41b2-b0c9-f8116244ba4b	DISCOVERY KIDS HD²	https://googleplusimages.com/DISCOVERYKIDS.png	https://example.com/stream.m3u8	Documentários	Discoverykids.br	78	2026-06-11 19:56:16.196748+00
ed254371-2393-44b0-b579-69cc3479b03c	CINEMAX HD²	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	79	2026-06-11 19:56:16.196748+00
629d4bcd-e96e-4faf-bb9c-7bb85680fb4e	WARNER CHANNEL HD¹	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	80	2026-06-11 19:56:16.196748+00
700810d8-da70-4a67-a845-4b6f4da946e4	GLOBOPLAY NOVELAS HD¹	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	81	2026-06-11 19:56:16.196748+00
a8666616-660e-45cc-91c0-77c51d3062c3	UNIVERSAL TV HD+	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	82	2026-06-11 19:56:16.196748+00
4dbef9ec-aab9-4d32-bc83-401f8e422ac6	NSC TV FLORIANÓPOLIS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	83	2026-06-11 19:56:16.196748+00
09f5c943-4a9a-4769-9954-ee76d70629aa	TNT SÉRIES HD¹	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	84	2026-06-11 19:56:16.196748+00
d5fff179-7cd7-4744-a819-5191714c14f1	TNT HD¹	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	85	2026-06-11 19:56:16.196748+00
92930e6a-6617-4740-85d9-9d62b837168d	HISTORY HD¹	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	86	2026-06-11 19:56:16.196748+00
bb92d1ff-79a1-4f62-9456-9d8fc2050674	TELECINE TOUCH HD¹	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	87	2026-06-11 19:56:16.196748+00
2f5ccf34-890e-42e6-836e-9c4b7e2dc489	TELECINE PREMIUM HD¹	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	88	2026-06-11 19:56:16.196748+00
0db50cd3-a13b-477c-be3a-aa331c7935e9	TELECINE PIPOCA HD¹	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	89	2026-06-11 19:56:16.196748+00
491b389d-d7aa-412d-9a72-6837ba5964fa	TELECINE FUN HD¹	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	90	2026-06-11 19:56:16.196748+00
0e9f0622-dbf6-44ee-8bae-eabf5c9e9fda	TELECINE ACTION HD²	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	91	2026-06-11 19:56:16.196748+00
d2869a18-fb3e-4845-810e-5d0faf0f0157	SPORTV HD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	92	2026-06-11 19:56:16.196748+00
dfe7a113-a696-4415-8d63-fae743199e07	SPORTV 2 HD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	94	2026-06-11 19:56:16.196748+00
09c2f793-df29-4e2d-a245-eea94f551741	SPACE HD¹	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	95	2026-06-11 19:56:16.196748+00
dee3f6bd-8ff7-476e-86ef-386f0372e9d1	PREMIERE CLUBES HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	96	2026-06-11 19:56:16.196748+00
df82585c-6d63-4c67-8087-3cd52eacee4a	CANAL OFF HD¹	https://googleplusimages.com/CANALOFF.png	https://example.com/stream.m3u8	Documentários	Off.br	97	2026-06-11 19:56:16.196748+00
ba10ccf5-79cc-40bb-b66f-5febe8494dbd	MULTISHOW HD¹	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	98	2026-06-11 19:56:16.196748+00
4a8fd394-9bcf-41ce-95bd-73e42bb8385c	HBO SIGNATURE HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	99	2026-06-11 19:56:16.196748+00
a7335283-2647-4b1d-8180-dbcf7279db0a	HBO + HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	100	2026-06-11 19:56:16.196748+00
749b3bf4-12b8-464f-a50d-41483a6cf30f	HBO HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	101	2026-06-11 19:56:16.196748+00
cd54a2a7-e6ec-499f-834f-81043286a452	HBO FAMILY HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	102	2026-06-11 19:56:16.196748+00
26ca2f87-2ae5-4fcb-a985-02a78c8f5104	HBO 2 HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	103	2026-06-11 19:56:16.196748+00
9011c98b-51ec-4fba-9ea6-6d57265b28fc	HISTORY 2 HD¹	https://i.imgur.com/JOmLdYI.png	https://example.com/stream.m3u8	Documentários	History.br	104	2026-06-11 19:56:16.196748+00
81140920-d145-4f12-b610-955457f3420f	GNT HD¹	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	105	2026-06-11 19:56:16.196748+00
9ed64497-bf4f-4105-9bfa-643bdeafea6f	ESPN4 HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	106	2026-06-11 19:56:16.196748+00
ab6da915-cf94-4039-a0fa-5a5c5985e14b	ESPN5 HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	107	2026-06-11 19:56:16.196748+00
f4dd0b97-c85d-44b3-b897-180a5d1cc91c	ESPN2 HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	108	2026-06-11 19:56:16.196748+00
7c7c2935-5ca6-42ce-b3c8-dae4d94042e9	ESPN HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	109	2026-06-11 19:56:16.196748+00
db2a680b-ea47-4ecb-9901-1b5da78ca1e2	ESPN3 HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	110	2026-06-11 19:56:16.196748+00
5c0e7e3e-7e85-4860-8366-90505995b375	DISCOVERY WORLD HD¹+	https://googleplusimages.com/DISCOVERYWORLD.png	https://example.com/stream.m3u8	Documentários	Discworld.br	111	2026-06-11 19:56:16.196748+00
8dfe700b-3ffb-4fb9-98b9-e40175d88c37	DISCOVERY TURBO HD¹	https://googleplusimages.com/DISCOVERYTURBO.png	https://example.com/stream.m3u8	Documentários	Discturbo.br	112	2026-06-11 19:56:16.196748+00
da54d5d6-0d4e-4198-aeff-09cf4c46180f	DISCOVERY THEATER HD²	https://googleplusimages.com/DISCOVERYTHEATER.png	https://example.com/stream.m3u8	Documentários	Disctheater.br	113	2026-06-11 19:56:16.196748+00
e816fac1-b526-4ae5-8233-ca0936e6ed13	DISCOVERY HOME & HEALTH HD¹	https://googleplusimages.com/DISCOVERYHOME&HEALTH.png	https://example.com/stream.m3u8	Documentários	Discoveryhomehealth.br	114	2026-06-11 19:56:16.196748+00
5e5d8494-c97b-4ab0-b83f-036ace0ceaea	DISCOVERY CHANNEL HD¹	https://googleplusimages.com/DISCOVERYCHANNEL.png	https://example.com/stream.m3u8	Documentários	Discovery.br	115	2026-06-11 19:56:16.196748+00
54ea1462-5aa6-452a-b90a-de217de6991d	COMBATE HD²	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	116	2026-06-11 19:56:16.196748+00
b0a45883-07e6-4c6d-a075-bcb1f0143296	CARTOON NETWORK HD¹	https://googleplusimages.com/CARTOONNETWORK.png	https://example.com/stream.m3u8	Infantil	Cartoonnetwork.br	117	2026-06-11 19:56:16.196748+00
2651a775-2dd8-4910-8c15-18922dc37a9c	SONY CHANNEL HD¹	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	118	2026-06-11 19:56:16.196748+00
a127de27-f60b-4fdc-93ab-8e07d0bed596	BIS HD¹	https://googleplusimages.com/BIS.png	https://example.com/stream.m3u8	Variedades/Música	Bis.br	119	2026-06-11 19:56:16.196748+00
f040a94a-062b-4c2e-bf5f-1bb4a59266c1	BANDSPORTS HD¹	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	120	2026-06-11 19:56:16.196748+00
531401f0-6c35-4302-9d39-cd11f9d04774	BAND SP HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	121	2026-06-11 19:56:16.196748+00
047b2473-e53b-48dd-83e6-12ac4eca121c	AXN HD¹	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	122	2026-06-11 19:56:16.196748+00
1c72aad5-c4d0-40fe-921f-e23eb3d0cc3f	E! HD²	https://googleplusimages.com/E!.png	https://example.com/stream.m3u8	Variedades/Música	E.br	123	2026-06-11 19:56:16.196748+00
d6daa7f9-1967-43cd-9bc1-bdcff4474702	A&E HD²	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	124	2026-06-11 19:56:16.196748+00
e3ffa32e-cf52-4ab0-b4cb-a67b14be61bf	TLC HD¹	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	125	2026-06-11 19:56:16.196748+00
2c5d027a-7e65-4847-accd-c1ce21e2bb67	TELECINE CULT HD¹	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	126	2026-06-11 19:56:16.196748+00
fd291901-8e3f-4282-a07b-3f98ff45a523	USA NETWORK HD¹	https://googleplusimages.com/USANETWORK.png	https://example.com/stream.m3u8	Geral	Usa.br	127	2026-06-11 19:56:16.196748+00
26570f52-6fc6-4db8-95b8-29e85bd6ed7c	HBO POP HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	128	2026-06-11 19:56:16.196748+00
fa4ad3eb-8408-4369-8919-d6413163c1fe	HBO XTREME HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	129	2026-06-11 19:56:16.196748+00
efff5a7f-c0ad-4a0c-8227-c71918fcec45	HBO MUNDI HD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	130	2026-06-11 19:56:16.196748+00
6c89f980-1d0e-41d9-8f2a-f618cfa7a770	MODO VIAGEM HD¹	https://googleplusimages.com/MODOVIAGEM.png	https://example.com/stream.m3u8	Geral	Modoviagem.br	131	2026-06-11 19:56:16.196748+00
09d17db8-fdfa-45ef-a1de-eece454674e4	LIFETIME HD¹	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	132	2026-06-11 19:56:16.196748+00
1cf6556e-8aff-4edb-bfe2-9f51181f3636	GLOOB HD¹	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	133	2026-06-11 19:56:16.196748+00
788b946a-101b-45e2-881d-0b6230b3ee93	GLOBONEWS HD¹	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	134	2026-06-11 19:56:16.196748+00
170e1c08-ca27-4376-b614-b6ffbe902f65	CINEMAX HD¹	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	135	2026-06-11 19:56:16.196748+00
d2ee7a36-c82b-48fd-a745-a1874d682263	CANAL BRASIL HD¹	https://googleplusimages.com/CANALBRASIL.png	https://example.com/stream.m3u8	Geral	Canalbrasil.br	136	2026-06-11 19:56:16.196748+00
6226375c-9b03-42b6-bf57-58de309ba4c2	WARNER CHANNEL H265¹	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	137	2026-06-11 19:56:16.196748+00
4cfd0629-17d2-4b52-bdb9-8e03017bb99f	UNIVERSAL TV H265¹	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	138	2026-06-11 19:56:16.196748+00
024c4d3a-884c-4e8a-a48b-96835cd2a501	TNT SÉRIES H265¹	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	139	2026-06-11 19:56:16.196748+00
4222dbf5-1f41-4ecf-bfc3-3c4c010fb85e	TNT H265¹	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	140	2026-06-11 19:56:16.196748+00
2324edaf-ebed-4190-bbbc-00e63ec3c952	TELECINE TOUCH H265¹	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	141	2026-06-11 19:56:16.196748+00
0a92d9e5-7fb1-4443-8448-3c27dd5e212e	TELECINE PREMIUM H265¹	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	142	2026-06-11 19:56:16.196748+00
77685580-ad04-4179-8b45-a0681737e2ee	TNT NOVELAS H265¹	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	143	2026-06-11 19:56:16.196748+00
7c1c297f-32b5-48bf-b626-ef03535846a0	PREMIERE 2 H265¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	144	2026-06-11 19:56:16.196748+00
2e0bb0bc-9a7d-4936-bfb5-a9802621816e	MULTISHOW H265¹	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	145	2026-06-11 19:56:16.196748+00
2c5c22d2-8888-449e-97d6-044af134ddd6	MEGAPIX H265¹	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	146	2026-06-11 19:56:16.196748+00
e7cc4ae6-f845-4c5b-95d8-b0c1d77befab	INVESTIGAÇÃO DISCOVERY H265¹	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	147	2026-06-11 19:56:16.196748+00
157b8a96-1031-4d2c-a89f-8e62212443f9	HBO 2 H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	148	2026-06-11 19:56:16.196748+00
93635d0f-fa2b-406e-a4dd-3b16086280e2	HBO SIGNATURE H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	149	2026-06-11 19:56:16.196748+00
1a699396-0bf1-445e-a151-6dd259e177d4	HBO + H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	150	2026-06-11 19:56:16.196748+00
730ffbed-b486-44b0-a7e5-05668a7f5562	HBO H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	151	2026-06-11 19:56:16.196748+00
19404048-81ad-48e8-874c-7597d82e8e87	HBO FAMILY H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	152	2026-06-11 19:56:16.196748+00
cac76a53-988f-44a7-b5e5-a7be32568192	GNT H265¹	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	153	2026-06-11 19:56:16.196748+00
73f14888-fe60-4a5e-8791-21b757763905	ESPN5 H265¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	154	2026-06-11 19:56:16.196748+00
f2f45dc3-639d-4756-80e1-ecb5454f1ea6	ESPN3 H265¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	155	2026-06-11 19:56:16.196748+00
bc0f4b63-4e1c-426e-8607-08d179a101d0	ESPN H265¹	https://i.ibb.co/GtvSTgW/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	156	2026-06-11 19:56:16.196748+00
baece81b-740b-488a-b1c8-755adce84e0d	BANDSPORTS H265¹	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	157	2026-06-11 19:56:16.196748+00
b61aa761-c673-4915-8900-ec3152104ff0	WARNER CHANNEL SD¹	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	158	2026-06-11 19:56:16.196748+00
ba4d4576-c44d-4f45-a15e-888fdc62445a	CANAL OFF SD¹	https://googleplusimages.com/CANALOFF.png	https://example.com/stream.m3u8	Documentários	Off.br	159	2026-06-11 19:56:16.196748+00
5e6ab931-e926-4aa6-8c2e-0a4a868889df	MULTISHOW SD¹	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	160	2026-06-11 19:56:16.196748+00
e27968ea-0461-43cd-abe5-a78b88a04096	HISTORY SD¹	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	161	2026-06-11 19:56:16.196748+00
ed6f6964-caba-4873-8036-7291f1e68d99	HISTORY 2 SD¹	https://i.imgur.com/JOmLdYI.png	https://example.com/stream.m3u8	Documentários	History2.br	162	2026-06-11 19:56:16.196748+00
66bbc783-9edd-4254-87d4-a5ee32d6fa46	GLOOB SD¹	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	163	2026-06-11 19:56:16.196748+00
ed379b48-6bb9-4a2b-9084-944fe6c1e793	GLOBO SP SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	164	2026-06-11 19:56:16.196748+00
a1767c1d-7c09-4483-8891-c910732dcbe6	FISHTV SD¹	https://googleplusimages.com/FISHTV.png	https://example.com/stream.m3u8	Geral	Fishtv.br	165	2026-06-11 19:56:16.196748+00
7e844aaa-97d4-4318-bfa2-40b9bd8bb1ea	FOOD NETWORK SD¹	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	166	2026-06-11 19:56:16.196748+00
07c73fff-f35d-4ef5-803c-c5a653afa66a	ESPN2 SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	167	2026-06-11 19:56:16.196748+00
ceabd096-06a3-4672-a6fe-ae258e5f3402	DISCOVERY KIDS SD¹	https://googleplusimages.com/DISCOVERYKIDS.png	https://example.com/stream.m3u8	Documentários	Discoverykids.br	168	2026-06-11 19:56:16.196748+00
eddc9e03-96b5-4437-9c0c-e1bc76960218	DISCOVERY TURBO SD¹	https://googleplusimages.com/DISCOVERYTURBO.png	https://example.com/stream.m3u8	Documentários	Discturbo.br	169	2026-06-11 19:56:16.196748+00
3dbd9ccb-4c6e-4ae8-a564-d58916a59810	CARTOON NETWORK SD¹	https://googleplusimages.com/CARTOONNETWORK.png	https://example.com/stream.m3u8	Infantil	Cartoonnetwork.br	170	2026-06-11 19:56:16.196748+00
4ec9482d-c103-4e3e-9fd1-8409587a320c	ANIMAL PLANET HD¹	https://googleplusimages.com/ANIMALPLANET.png	https://example.com/stream.m3u8	Documentários	Animalplanet.br	171	2026-06-11 19:56:16.196748+00
1f78f878-9538-4c1a-bed4-cc1c7b66e902	AXN SD¹	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	172	2026-06-11 19:56:16.196748+00
3041ed9c-2d43-489b-9528-6f1b64252109	(+18) VENUS HD²	https://googleplusimages.com/VENUS.png	https://example.com/stream.m3u8	Adulto	Venus.br	173	2026-06-11 19:56:16.196748+00
e84e673c-58dd-4553-b18c-5a1e54097e84	TNT SÉRIES SD¹	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	174	2026-06-11 19:56:16.196748+00
550f8d63-6560-4e02-990e-b0a76049e946	TNT SD¹	https://i.imgur.com/mHfzG0c.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	175	2026-06-11 19:56:16.196748+00
a1e96e8a-cc06-45f9-90b8-2c8cbec222e7	TELECINE TOUCH SD¹	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	176	2026-06-11 19:56:16.196748+00
88edab00-483d-4256-bdad-7f9604effc44	TELECINE PREMIUM SD¹	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	177	2026-06-11 19:56:16.196748+00
a0d3b7f3-587b-44b1-90f4-b76aaad6bf9b	TELECINE PIPOCA SD¹	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	178	2026-06-11 19:56:16.196748+00
5f49fc8c-1931-4573-89cf-6d2a059fa0f0	TELECINE FUN SD¹	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	179	2026-06-11 19:56:16.196748+00
cee38d3b-84fe-4279-a8f7-59c352c5d648	TELECINE CULT SD¹	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	180	2026-06-11 19:56:16.196748+00
ac5773da-680b-4eba-a881-24007632d3ec	TNT NOVELAS SD¹	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	181	2026-06-11 19:56:16.196748+00
813723ea-3b04-45fe-a71e-7c165367c6c1	SPORTV SD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	182	2026-06-11 19:56:16.196748+00
b281ea45-d270-4608-b2c1-cf729649fc06	SPORTV 3 SD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	183	2026-06-11 19:56:16.196748+00
7552a682-6f54-4ac0-9f56-ee0f1f3ac9ad	SPORTV 2 SD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	184	2026-06-11 19:56:16.196748+00
9a1732b7-3301-4813-9b88-ba6275ecace9	(+18) SEXTREME HD¹	https://googleplusimages.com/SEXTREME.png	https://example.com/stream.m3u8	Adulto	Sextreme.br	185	2026-06-11 19:56:16.196748+00
aba3ffe3-e48a-47dc-9008-0f33ba651613	SBT SP SD¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	186	2026-06-11 19:56:16.196748+00
de342e0b-2810-4597-a846-b8082f8e14f8	RECORD SP SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	187	2026-06-11 19:56:16.196748+00
ddaa03d1-d6c0-4265-9690-13bd3993ffe8	RBS TV PORTO ALEGRE SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	188	2026-06-11 19:56:16.196748+00
4ecb0952-0be1-4cf6-bbb2-888018890066	PRIME BOX BRAZIL SD¹	https://googleplusimages.com/PRIMEBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Primeboxbr.br	189	2026-06-11 19:56:16.196748+00
88f2aa11-4579-4c0c-9e20-a1bab19d1a96	PREMIERE 7 SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere7.br	190	2026-06-11 19:56:16.196748+00
8bce2a10-ec27-4156-9f2c-b3b6fb39f03b	PREMIERE 6 SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere6.br	191	2026-06-11 19:56:16.196748+00
24c20d66-01db-4bd0-9032-f54f1a546a80	PREMIERE 5 SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere5.br	192	2026-06-11 19:56:16.196748+00
e5ca6a26-203b-421b-9ee8-1f5e1d04e9e1	PREMIERE 4 SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere4.br	193	2026-06-11 19:56:16.196748+00
424e1604-c309-4340-8438-0d09511c1d48	PREMIERE 3 SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere3.br	194	2026-06-11 19:56:16.196748+00
ae02315b-b9ab-4803-b646-35d7ddf00191	PREMIERE 2 SD¹	https://i.ibb.co/X3GXCSD/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	195	2026-06-11 19:56:16.196748+00
e4c0afcb-dcbb-41b4-8483-d71992819c40	PREMIERE CLUBES SD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	196	2026-06-11 19:56:16.196748+00
98ae92af-1159-4ca8-9e53-04e1a3151475	(+18) PLAYBOY TV HD¹	https://googleplusimages.com/PLAYBOYTV.png	https://example.com/stream.m3u8	Adulto	Playboytv.br	197	2026-06-11 19:56:16.196748+00
7c8cc6a1-b357-48ce-b230-320ec64a75c4	LIFETIME SD¹	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	198	2026-06-11 19:56:16.196748+00
438d7680-ecd1-4218-9dac-90e71c3c36c3	HBO FAMILY SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	199	2026-06-11 19:56:16.196748+00
9b3b1fab-d9b5-48c7-ad76-c1933ac9a56d	HBO SIGNATURE SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	200	2026-06-11 19:56:16.196748+00
e71a9ecc-4af2-4366-9836-7cd95dc24211	HBO + SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	201	2026-06-11 19:56:16.318574+00
0b71263e-f060-4f33-aef6-37943b535c2f	HBO SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	202	2026-06-11 19:56:16.318574+00
f0ebbd81-78e4-4c52-ab92-7beee18262ef	HBO 2 SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	203	2026-06-11 19:56:16.318574+00
31e6f18a-4f31-43d0-8287-b58399ab954a	GLOBO RIO SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	204	2026-06-11 19:56:16.318574+00
a545b2e2-ccf2-4be9-b6b6-d1191fe5d994	FUTURA SD¹	https://googleplusimages.com/FUTURA.png	https://example.com/stream.m3u8	Geral	Futura.br	205	2026-06-11 19:56:16.318574+00
8fc3cd84-9d61-4388-93b2-7a798cb07ee8	ESPN5 SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	206	2026-06-11 19:56:16.318574+00
96ce124c-7585-4a4c-a0b4-7f2ef6668537	ESPN4 SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	207	2026-06-11 19:56:16.318574+00
abbf89c3-c2e4-44d2-a843-89b6c12e3f7d	ESPN SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	208	2026-06-11 19:56:16.318574+00
5684e732-7597-4ad7-8abe-dc1d536259b7	E! SD¹	https://googleplusimages.com/E!.png	https://example.com/stream.m3u8	Variedades/Música	E.br	209	2026-06-11 19:56:16.318574+00
4300205b-a966-405e-843e-a8fc7a01d345	DISCOVERY SCIENCE SD¹	https://googleplusimages.com/DISCOVERYSCIENCE.png	https://example.com/stream.m3u8	Documentários	Discscience.br	210	2026-06-11 19:56:16.318574+00
d1a9550d-d5eb-45f0-884e-3a264dd5f348	HGTV SD¹	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	211	2026-06-11 19:56:16.318574+00
d985b1c5-741e-4202-930a-bc8b79e27401	COMBATE SD¹	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	212	2026-06-11 19:56:16.318574+00
047d3662-374a-4373-8ed9-3d6032d9e780	CINEMAX SD¹	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	213	2026-06-11 19:56:16.318574+00
53d4e773-7aad-4c5f-bdc5-e43bd52bb62d	CARTOONITO SD¹	https://googleplusimages.com/CARTOONITO.png	https://example.com/stream.m3u8	Infantil	Cartoonito.br	214	2026-06-11 19:56:16.318574+00
36562123-b23d-4043-b43c-6b00842b83f6	BANDSPORTS SD¹	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	215	2026-06-11 19:56:16.318574+00
7d628ec1-20a0-48af-882b-4f7cf9b95088	BANDNEWS TV SD¹	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	216	2026-06-11 19:56:16.318574+00
5996f5d1-2d3d-4a4d-8320-14bbab9a78f7	BAND SP SD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	217	2026-06-11 19:56:16.318574+00
53fd2d24-da68-438e-9794-ace94d8100d8	A&E HD¹	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	218	2026-06-11 19:56:16.318574+00
dce617da-d2e8-46b2-a74a-1c7c709fef2d	INVESTIGAÇÃO DISCOVERY HD¹	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	219	2026-06-11 19:56:16.318574+00
613a8efe-95a3-411b-bdce-54c7a41e9613	HBO POP SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	220	2026-06-11 19:56:16.318574+00
86a98b51-0a47-48b3-8832-b4633cf9447d	HBO MUNDI SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	221	2026-06-11 19:56:16.318574+00
4cb0d13a-684c-4437-870e-a58b79a9becf	HBO XTREME SD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	222	2026-06-11 19:56:16.318574+00
eb462cb4-040f-4427-88ee-bff735afbb0f	UNIVERSAL TV SD¹	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	223	2026-06-11 19:56:16.318574+00
27e7f7db-7387-4287-b94f-bcf0a384aff3	STUDIO UNIVERSAL SD¹	https://googleplusimages.com/STUDIOUNIVERSAL.png	https://example.com/stream.m3u8	Filmes/Séries	Studiouniversal.br	224	2026-06-11 19:56:16.318574+00
7df77b4e-5237-411c-90cc-159ef698f05f	MEGAPIX SD¹	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	225	2026-06-11 19:56:16.318574+00
fde84f08-9e08-4730-9d67-c997beecacf5	SPACE SD¹	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	226	2026-06-11 19:56:16.318574+00
c789114b-d0f4-489c-8401-3e8c9dff1bfa	SONY CHANNEL SD¹	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	227	2026-06-11 19:56:16.318574+00
0e984c8a-64c6-43ea-b585-5492155571d7	CANAL BRASIL SD¹	https://googleplusimages.com/CANALBRASIL.png	https://example.com/stream.m3u8	Geral	Canalbrasil.br	228	2026-06-11 19:56:16.318574+00
c167759b-48cd-476e-83be-ade9d2271f42	A&E SD¹	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	229	2026-06-11 19:56:16.318574+00
decd5fe2-dc79-45df-a0ca-862f6111a5bd	GLOBO MINAS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globomg.br	230	2026-06-11 19:56:16.318574+00
12b49918-f6f1-4b7d-8d1c-e885c690d728	GLOBO MINAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globomg.br	231	2026-06-11 19:56:16.318574+00
a7a53179-af7a-4408-8f94-82ed9b7864da	ADULT SWIM SD¹	https://googleplusimages.com/ADULTSWIM.png	https://example.com/stream.m3u8	Geral	Adultswim.br	232	2026-06-11 19:56:16.318574+00
c4a88060-4c90-4dbb-9d9c-ca16ad9555dd	DISCOVERY THEATER SD¹	https://i.imgur.com/jCq7OQj.png	https://example.com/stream.m3u8	Documentários	Hdtheater.br	233	2026-06-11 19:56:16.318574+00
1b24e83c-d6c0-4e08-bb84-7e936a5fc19f	DISCOVERY HOME & HEALTH SD¹	https://googleplusimages.com/DISCOVERYHOME&HEALTH.png	https://example.com/stream.m3u8	Documentários	Discoveryhomehealth.br	234	2026-06-11 19:56:16.318574+00
1c4f0dde-7fd9-462c-8852-c356702b2e23	BIS SD¹	https://googleplusimages.com/BIS.png	https://example.com/stream.m3u8	Variedades/Música	Bis.br	235	2026-06-11 19:56:16.318574+00
693b1784-d7d7-4ad1-8b79-e5139f877fd1	TNT NOVELAS HD¹	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	236	2026-06-11 19:56:16.318574+00
c20ef7ba-19bc-4be7-a028-e7dbc04fee96	MEGAPIX HD¹	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	237	2026-06-11 19:56:16.318574+00
3d7eb794-ef47-4454-be24-e11e81e2a7c3	E! HD¹	https://googleplusimages.com/E!.png	https://example.com/stream.m3u8	Variedades/Música	E.br	238	2026-06-11 19:56:16.318574+00
a180c389-10c8-4bca-bbe3-56b38d4c2fa5	ANIMAL PLANET SD¹	https://googleplusimages.com/ANIMALPLANET.png	https://example.com/stream.m3u8	Documentários	Animalplanet.br	239	2026-06-11 19:56:16.318574+00
5188644a-715d-4cbc-b57d-a85d415c387c	(+18) BRASILEIRINHAS FHD²	https://googleplusimages.com/BRASILEIRINHAS.png	https://example.com/stream.m3u8	Adulto	Adultos.br	240	2026-06-11 19:56:16.318574+00
7bfcc671-ac85-44f9-8a84-860d70903905	WOOHOO SD¹	https://googleplusimages.com/WOOHOO.png	https://example.com/stream.m3u8	Geral	Woohoo.br	241	2026-06-11 19:56:16.318574+00
82fc7169-741e-489f-8eb8-82856e2d672c	TELECINE PREMIUM FHD¹	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	242	2026-06-11 19:56:16.318574+00
0fe274af-bb22-4c41-a56e-1ef9f2e5e3a2	AMC HD²	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	243	2026-06-11 19:56:16.318574+00
dc7ba447-adb3-429b-8b41-d9fe0291335d	TV RÁ TIM BUM SD¹	https://googleplusimages.com/TVRaTIMBUM.png	https://example.com/stream.m3u8	Geral	Tvratimbum.br	244	2026-06-11 19:56:16.318574+00
343edd9e-751b-4421-abbb-8ebcdee6be8d	REDETV! SP HD¹	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Abertos	Redetvsp.br	245	2026-06-11 19:56:16.318574+00
2dd087da-9949-44b7-899c-86bceae78e44	PREMIERE 5 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere5.br	246	2026-06-11 19:56:16.318574+00
5e46b303-027a-4a27-82b3-049222c03ab2	PREMIERE 4 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere4.br	247	2026-06-11 19:56:16.318574+00
84e00a7f-56fe-4a06-86f0-b7725df8b184	GLOOBINHO HD¹	https://googleplusimages.com/GLOOBINHO.png	https://example.com/stream.m3u8	Infantil	Gloobinho.br	248	2026-06-11 19:56:16.318574+00
411de055-c15a-4989-978d-93851b510715	GLOOBINHO SD¹	https://googleplusimages.com/GLOOBINHO.png	https://example.com/stream.m3u8	Infantil	Gloobinho.br	249	2026-06-11 19:56:16.318574+00
335ec23e-3fb2-4609-8a51-320f71903147	PREMIERE 3 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere3.br	250	2026-06-11 19:56:16.318574+00
f280d16d-26ee-4a50-b58c-ffccc299d6c6	PREMIERE 2 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	251	2026-06-11 19:56:16.318574+00
8955b003-fbda-43e2-a3eb-eb52432b6bdb	EPTV RIBEIRÃO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	252	2026-06-11 19:56:16.318574+00
7a6c0097-7879-4fd2-8c00-480d0bd3c319	ESPN6 SD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn6.br	253	2026-06-11 19:56:16.318574+00
7a54ef79-2f80-4d97-9e84-0085a0c99532	SBT SP HD+	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	254	2026-06-11 19:56:16.318574+00
1f960b62-7275-4a83-b291-62f5667152cd	MODO VIAGEM SD¹	https://googleplusimages.com/MODOVIAGEM.png	https://example.com/stream.m3u8	Geral	Modoviagem.br	255	2026-06-11 19:56:16.318574+00
e980a3b6-d22d-4e17-8dd3-1c0423360089	ESPN6 H265¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn6.br	256	2026-06-11 19:56:16.318574+00
ad5303e5-6462-4b8a-acf0-e05258fad51a	TV ANHANGUERA GOIÂNIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	257	2026-06-11 19:56:16.318574+00
5842c1f0-ebb7-4b5b-822a-b8c6c11cdaa8	GLOBO SP HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	258	2026-06-11 19:56:16.318574+00
c45cd380-7730-4f37-8e15-94afa3b4b21b	COMBATE FHD¹	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	259	2026-06-11 19:56:16.318574+00
f0330cce-f36c-4767-ad5f-df79ba815d7d	TELECINE ACTION FHD¹	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	260	2026-06-11 19:56:16.318574+00
73dace48-097d-4112-a490-588900735254	TELECINE PIPOCA FHD¹	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	261	2026-06-11 19:56:16.318574+00
68a09297-5e8d-4b61-be96-0d802d22f9a0	TELECINE TOUCH FHD¹	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	262	2026-06-11 19:56:16.318574+00
c1b06240-5367-4b97-b467-fd533139455d	TV APARECIDA HD¹	https://i.imgur.com/TAaiWqh.png	https://example.com/stream.m3u8	Abertos	Tvaparecida.br	263	2026-06-11 19:56:16.318574+00
86d09206-8ed6-4401-8c7d-5c41799a669c	AMC SD¹	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	264	2026-06-11 19:56:16.318574+00
818601c1-deea-4ff1-bfbd-0f08827b7f0b	PREMIERE 7 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere7.br	265	2026-06-11 19:56:16.318574+00
026f8774-af3a-4965-bb2c-32c6e6a5790e	PREMIERE 6 HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere6.br	266	2026-06-11 19:56:16.318574+00
d2fcbd69-5aad-4d88-ba25-60cc6bead74f	GNT SD¹	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	267	2026-06-11 19:56:16.318574+00
00180eba-99a5-44a0-ac00-52b19718dd57	GLOBOPLAY NOVELAS SD¹	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	268	2026-06-11 19:56:16.318574+00
b1328db4-10c5-43af-8f57-7f49eed018e0	TLC SD¹	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	269	2026-06-11 19:56:16.318574+00
730aa209-801f-4093-ba08-c1251bfbbdf4	FOOD NETWORK HD¹	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	270	2026-06-11 19:56:16.318574+00
c46bacb9-5482-4d12-ba76-fd38596d854f	GLOBONEWS SD¹	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	271	2026-06-11 19:56:16.318574+00
5087a342-3e4e-4dc3-bcff-8c2fc9301380	USA NETWORK SD¹	https://googleplusimages.com/USANETWORK.png	https://example.com/stream.m3u8	Geral	Usa.br	272	2026-06-11 19:56:16.318574+00
6fec151c-993c-4cc2-82c9-83aa196c7a94	TELECINE FUN FHD¹	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	273	2026-06-11 19:56:16.318574+00
2d06ad77-7523-4303-8465-b1dfc8a2f790	SBT SP FHD+	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	274	2026-06-11 19:56:16.318574+00
295051d8-e313-40bd-90fe-f56b7e0ced9c	RECORD NACIONAL FHD+	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	275	2026-06-11 19:56:16.318574+00
89f39204-eb51-47fe-8747-98a212be883d	BAND SP FHD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	276	2026-06-11 19:56:16.318574+00
ae638d10-f9ba-4a16-b582-3df61181abe1	HBO 2 FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	277	2026-06-11 19:56:16.318574+00
afd3fdf5-8ae6-41d9-b26e-e4afbefa048a	HBO FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	278	2026-06-11 19:56:16.318574+00
119f7411-1060-4249-b5b7-227c2f8ce62b	GLOBO RIO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	279	2026-06-11 19:56:16.318574+00
2e4067c2-0aad-4945-a64b-8f958e0b313b	GLOBO SP FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	280	2026-06-11 19:56:16.318574+00
546eb795-3ccc-41c3-9412-60eba782e0e2	DISCOVERY SCIENCE HD²	https://googleplusimages.com/DISCOVERYSCIENCE.png	https://example.com/stream.m3u8	Documentários	Discscience.br	281	2026-06-11 19:56:16.318574+00
66e6f111-8fbc-4bc9-9642-d5a129ff37ff	HGTV HD²	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	282	2026-06-11 19:56:16.318574+00
00f9cd72-a151-4cff-918e-c32ccb5e1e81	CURTA! HD¹	https://i.imgur.com/w10VeH2.png	https://example.com/stream.m3u8	Geral	Curta.br	283	2026-06-11 19:56:16.318574+00
fdda39fd-1c38-47b4-8c15-d01500b416cd	DISCOVERY CHANNEL FHD¹	https://googleplusimages.com/DISCOVERYCHANNEL.png	https://example.com/stream.m3u8	Documentários	Discovery.br	284	2026-06-11 19:56:16.318574+00
935f8f6f-68f1-423c-a850-367015c304c4	AMC HD+	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	285	2026-06-11 19:56:16.318574+00
550167cb-8ce7-4d42-8ca4-b448e3cc4c63	ARTE 1 HD¹	https://googleplusimages.com/ARTE1.png	https://example.com/stream.m3u8	Documentários	Arte1.br	286	2026-06-11 19:56:16.318574+00
3bdfcfa6-3ea2-4486-9fd2-e331ec085afe	WOOHOO HD¹	https://googleplusimages.com/WOOHOO.png	https://example.com/stream.m3u8	Geral	Woohoo.br	287	2026-06-11 19:56:16.318574+00
0271a99b-f399-4cdb-aefd-bed45bcea439	DISCOVERY SCIENCE HD¹	https://googleplusimages.com/DISCOVERYSCIENCE.png	https://example.com/stream.m3u8	Documentários	Discscience.br	288	2026-06-11 19:56:16.318574+00
026341e4-6a87-46cd-82c1-292030184310	HGTV HD¹	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	289	2026-06-11 19:56:16.318574+00
c092aca8-fe13-4e9a-8627-56fc6a254714	SPORTV H265¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	290	2026-06-11 19:56:16.318574+00
4cccdbf0-87bb-4f70-b794-03c6d2c9a068	SPORTV 2 H265¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	291	2026-06-11 19:56:16.318574+00
a62764bf-94ae-44af-8007-d297ea6ee7b8	HGTV H265¹	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	292	2026-06-11 19:56:16.318574+00
d4f894fd-32b3-48c9-8b49-2bca825e4c5f	WOOHOO H265²	https://googleplusimages.com/WOOHOO.png	https://example.com/stream.m3u8	Geral	Woohoo.br	293	2026-06-11 19:56:16.318574+00
d1c23c31-2ef3-4227-895e-00d2f5559a29	MODO VIAGEM FHD¹	https://googleplusimages.com/MODOVIAGEM.png	https://example.com/stream.m3u8	Geral	Modoviagem.br	294	2026-06-11 19:56:16.318574+00
19313d80-c0ba-4966-8aca-2ad1cba7e694	BIS FHD+	https://googleplusimages.com/BIS.png	https://example.com/stream.m3u8	Variedades/Música	Bis.br	295	2026-06-11 19:56:16.318574+00
60a7b6ab-a1bb-409c-81c0-121193356727	TV RÁ TIM BUM HD¹	https://googleplusimages.com/TVRaTIMBUM.png	https://example.com/stream.m3u8	Geral	Tvratimbum.br	296	2026-06-11 19:56:16.318574+00
c433d403-e498-4706-bb33-e77badac4da2	PRIME BOX BRAZIL HD¹	https://googleplusimages.com/PRIMEBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Primeboxbr.br	297	2026-06-11 19:56:16.318574+00
d073588c-0962-4cb9-802c-09b1ce253ec1	MUSIC BOX BRAZIL HD²	https://googleplusimages.com/MUSICBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Musicboxbr.br	298	2026-06-11 19:56:16.318574+00
6bd8c9a1-7cfe-4a94-b1aa-ead1eafcf59f	TV BAHIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	299	2026-06-11 19:56:16.318574+00
f333813f-a693-44b1-a686-c109c3f0742f	FUTURA HD¹	https://googleplusimages.com/FUTURA.png	https://example.com/stream.m3u8	Geral	Futura.br	300	2026-06-11 19:56:16.318574+00
c073ba0c-48b7-4629-b003-b7fb87b3fcef	CARTOONITO HD¹	https://googleplusimages.com/CARTOONITO.png	https://example.com/stream.m3u8	Infantil	Cartoonito.br	301	2026-06-11 19:56:16.318574+00
e316e203-1da1-451d-99c8-a9ef07ce0519	BANDNEWS TV HD¹	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	302	2026-06-11 19:56:16.318574+00
f70f6815-656e-42d4-b8ee-754c780e9a80	PREMIERE 7 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere7.br	303	2026-06-11 19:56:16.318574+00
15ea6eee-6761-491a-ad3d-0045dee62744	PREMIERE 6 HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere6.br	304	2026-06-11 19:56:16.318574+00
9c066ec5-11a1-458e-b7df-15731ca6dfe1	SPORTV 3 H265¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	305	2026-06-11 19:56:16.318574+00
bb66993d-8fb3-441d-ae22-1d687d78c4e6	WARNER CHANNEL FHD¹	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	306	2026-06-11 19:56:16.318574+00
9fd2ad4a-7caa-4854-a15b-fc193c125099	HISTORY FHD¹	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	307	2026-06-11 19:56:16.318574+00
4c8164b9-9c02-4221-ae8f-49d85616777b	DISCOVERY WORLD FHD¹	https://googleplusimages.com/DISCOVERYWORLD.png	https://example.com/stream.m3u8	Documentários	Discworld.br	308	2026-06-11 19:56:16.318574+00
eae56c7c-e3db-4010-b488-5d776349b873	DISCOVERY TURBO FHD¹	https://googleplusimages.com/DISCOVERYTURBO.png	https://example.com/stream.m3u8	Documentários	Discturbo.br	309	2026-06-11 19:56:16.318574+00
b1c7e1b6-7360-4369-9572-80fdde38f1de	DISCOVERY KIDS FHD¹	https://googleplusimages.com/DISCOVERYKIDS.png	https://example.com/stream.m3u8	Documentários	Discoverykids.br	310	2026-06-11 19:56:16.318574+00
70961eec-20dc-405d-be01-53d163898f9f	CARTOONITO FHD¹	https://googleplusimages.com/CARTOONITO.png	https://example.com/stream.m3u8	Infantil	Cartoonito.br	311	2026-06-11 19:56:16.318574+00
01eced4d-e8fe-441f-a024-d6025719d4b9	BANDNEWS TV FHD¹	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	312	2026-06-11 19:56:16.318574+00
02ba133f-4eac-4646-b631-7bd636b0530d	ANIMAL PLANET FHD¹	https://googleplusimages.com/ANIMALPLANET.png	https://example.com/stream.m3u8	Documentários	Animalplanet.br	313	2026-06-11 19:56:16.318574+00
828e1229-ffe6-413e-b3d1-7d8fe0d1d9da	GLOBO NORDESTE SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	314	2026-06-11 19:56:16.318574+00
e994e46c-5792-40f0-b32e-29f19e0cd271	GLOBO BRASÍLIA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globodf.br	315	2026-06-11 19:56:16.318574+00
b94040e1-53f3-41ec-b860-26a02cf0e225	CURTA! SD¹	https://i.imgur.com/w10VeH2.png	https://example.com/stream.m3u8	Geral	Curta.br	316	2026-06-11 19:56:16.318574+00
1ea98fbb-1c3f-4316-bd43-3a8c75d7e9f7	ARTE 1 SD¹	https://googleplusimages.com/ARTE1.png	https://example.com/stream.m3u8	Documentários	Arte1.br	317	2026-06-11 19:56:16.318574+00
38ea9946-e2dd-4d25-9f3f-37ed7d0aaf3f	DISCOVERY WORLD SD¹	https://googleplusimages.com/DISCOVERYWORLD.png	https://example.com/stream.m3u8	Documentários	Discworld.br	318	2026-06-11 19:56:16.318574+00
d6e42530-8963-4de8-b624-bc26fff1c8d5	RECORD NEWS SD¹	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Abertos	Recordnews.br	319	2026-06-11 19:56:16.318574+00
68c8310f-6583-465f-b607-0875b63cddf6	FISHTV HD¹	https://googleplusimages.com/FISHTV.png	https://example.com/stream.m3u8	Geral	Fishtv.br	320	2026-06-11 19:56:16.318574+00
215e00c2-a274-47fa-91dc-cc08b3547a4e	ADULT SWIM HD+	https://googleplusimages.com/ADULTSWIM.png	https://example.com/stream.m3u8	Geral	Adultswim.br	321	2026-06-11 19:56:16.318574+00
64448d94-f231-49c0-a714-24e5cc8e27cc	GLOBO BRASÍLIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globodf.br	322	2026-06-11 19:56:16.318574+00
71f1b6c4-dac2-49bc-af58-dfbb80e60733	EPTV CAMPINAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	323	2026-06-11 19:56:16.318574+00
1712abd2-12ac-4e06-a4ee-adabf684dfea	[LEG] HBO XTREME HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	324	2026-06-11 19:56:16.318574+00
3ac7123e-f181-4b18-8ad0-0448ffa7680c	[LEG] TELECINE TOUCH HD²	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	325	2026-06-11 19:56:16.318574+00
4f02b84b-2451-4c21-a396-4a8535adb958	[LEG] TELECINE PIPOCA FHD²	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	326	2026-06-11 19:56:16.318574+00
ea3a6e5c-42ae-4f62-a4af-273a2fcddcbe	[LEG] TELECINE FUN HD²	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	327	2026-06-11 19:56:16.318574+00
e3d357cf-bc45-41bb-b2d7-c009852f76b2	[LEG] TELECINE ACTION HD²	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	328	2026-06-11 19:56:16.318574+00
e09c0ae3-37d3-4755-96dc-0669f6d36bfe	[LEG] TELECINE PREMIUM HD²	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	329	2026-06-11 19:56:16.318574+00
2eed2bd9-ed7b-479f-aa02-0116ef30c6d0	[LEG] HBO POP HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	330	2026-06-11 19:56:16.318574+00
d1945793-d382-427a-be11-0c3eecfefc86	GLOBONEWS H265¹	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	331	2026-06-11 19:56:16.318574+00
278b50cb-24db-42ba-be35-69ba9a4037a8	STUDIO UNIVERSAL H265¹	https://googleplusimages.com/STUDIOUNIVERSAL.png	https://example.com/stream.m3u8	Filmes/Séries	Studiouniversal.br	332	2026-06-11 19:56:16.318574+00
1aa8025b-aeca-4c56-b4d3-f6f98fe37aa0	LIFETIME H265¹	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	333	2026-06-11 19:56:16.318574+00
38a21251-ec6e-42c8-a806-91b245242b43	FOOD NETWORK H265¹	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	334	2026-06-11 19:56:16.318574+00
a6e447f6-1f79-4da8-ae5c-f598a35288e9	SONY CHANNEL H265¹	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	335	2026-06-11 19:56:16.318574+00
5ebcd0cd-46f9-4557-b384-95d8b295944f	SPACE H265¹	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	336	2026-06-11 19:56:16.318574+00
f6bcb6b9-7429-4f14-89e2-fefc0f679af6	TV SERGIPE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globose.br	337	2026-06-11 19:56:16.318574+00
91b57546-0a1f-4c59-82ff-ca11cc19eb32	TV SERGIPE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globose.br	338	2026-06-11 19:56:16.318574+00
1e9477d8-258f-4ff7-92c8-6ccbc3bf9df0	TV CLUBE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	339	2026-06-11 19:56:16.318574+00
a2188d84-55b3-420d-bc71-18ef48b98d5f	TV TEM S. J. DO RIO PRETO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	340	2026-06-11 19:56:16.318574+00
aa49fc01-df0c-44a2-ac1d-cd8e110f4a7c	NSC TV FLORIANÓPOLIS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	341	2026-06-11 19:56:16.318574+00
2428a9d4-fd22-4a1c-99fb-b64de2308924	TV MORENA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	342	2026-06-11 19:56:16.318574+00
4f4838fd-fa54-404a-85ca-a76a33141c67	TV MIRANTE SÃO LUÍS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	343	2026-06-11 19:56:16.318574+00
98009559-c373-4bc1-984e-e0e339dc7cd5	TV BAHIA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	344	2026-06-11 19:56:16.318574+00
a43d2c4a-2ea4-4025-a8a1-f1504cbb91b4	TV ANHANGUERA GOIÂNIA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	345	2026-06-11 19:56:16.318574+00
cd947cde-4ae0-4a1e-af91-3ac613b93a4f	EPTV CAMPINAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	346	2026-06-11 19:56:16.318574+00
da5dc48b-6bc8-47fb-8d81-da4f26ea84b6	GLOBO NORDESTE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	347	2026-06-11 19:56:16.318574+00
ab15eb2f-9832-4bbe-babd-8c6fcad67609	UNIVERSAL TV FHD¹	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	348	2026-06-11 19:56:16.318574+00
ec7495dc-e766-4c30-b1e3-843dbd8957c7	TV RÁ TIM BUM FHD¹	https://googleplusimages.com/TVRaTIMBUM.png	https://example.com/stream.m3u8	Geral	Tvratimbum.br	349	2026-06-11 19:56:16.318574+00
0bb0bfa7-e2ed-4acf-8f19-0af4464def42	TNT SÉRIES FHD¹	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	350	2026-06-11 19:56:16.318574+00
092abc52-60d3-4da5-a295-e8ed6a211c2a	TNT FHD¹	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	351	2026-06-11 19:56:16.318574+00
f336d29c-a510-49ec-8827-b9d0678ee16f	TLC FHD¹	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	352	2026-06-11 19:56:16.318574+00
3e1e2ae3-5033-4cf0-a730-fd8c7aad9aef	TELECINE CULT FHD¹	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	353	2026-06-11 19:56:16.318574+00
1cc5e34c-e1ad-40b5-b09b-70849fcc99ac	TNT NOVELAS FHD¹	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	354	2026-06-11 19:56:16.318574+00
324e8a5a-522d-48ad-8a2e-6754441412aa	USA NETWORK FHD¹	https://googleplusimages.com/USANETWORK.png	https://example.com/stream.m3u8	Geral	Usa.br	355	2026-06-11 19:56:16.318574+00
1898b88e-72ac-4c83-adec-1d69371d8a0b	SPACE FHD¹	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	356	2026-06-11 19:56:16.318574+00
42fd5b62-e6b6-414b-85e5-3a614c54d815	(+18) PLAYBOY TV HD²	https://googleplusimages.com/PLAYBOYTV.png	https://example.com/stream.m3u8	Adulto	Playboytv.br	357	2026-06-11 19:56:16.318574+00
6ee79aa6-8354-4021-bcc3-8a7142151477	MULTISHOW FHD¹	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	358	2026-06-11 19:56:16.318574+00
e543b18b-d11e-44b5-9735-c3c15a0c35ae	HBO POP FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	359	2026-06-11 19:56:16.318574+00
41284177-fcd9-4a19-a44c-58b245abbb5f	HBO XTREME FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	360	2026-06-11 19:56:16.318574+00
e3bb0cd3-d55b-4d23-a387-acaffdb30d4b	HBO MUNDI FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	361	2026-06-11 19:56:16.318574+00
a99badb0-7a20-4584-9cbf-2a32422a1a00	LIFETIME FHD¹	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	362	2026-06-11 19:56:16.318574+00
b18de872-ca8f-46c5-b87f-e6c88dca6550	INVESTIGAÇÃO DISCOVERY FHD¹	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	363	2026-06-11 19:56:16.318574+00
ed7c0c6f-8a5e-4975-ae26-4cbf7a3e7795	HBO SIGNATURE FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	364	2026-06-11 19:56:16.318574+00
39e333f2-5376-4a2d-a47d-7328f6c73894	HBO + FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	365	2026-06-11 19:56:16.318574+00
614826c8-311e-41f5-96a0-c8453d8b8f93	HBO FAMILY FHD¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	366	2026-06-11 19:56:16.318574+00
b3387c18-6183-41fb-98ab-afa82420b8a5	HISTORY 2 FHD¹	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History2.br	367	2026-06-11 19:56:16.318574+00
389b1721-ea1a-4e40-be05-385edb407718	GNT FHD¹	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	368	2026-06-11 19:56:16.318574+00
cb2c18b2-8962-45a0-91af-9c7395635d52	GLOOBINHO FHD¹	https://googleplusimages.com/GLOOBINHO.png	https://example.com/stream.m3u8	Infantil	Gloobinho.br	369	2026-06-11 19:56:16.318574+00
b4bc5996-2d2a-43c5-ba54-1373bf5032fb	FOOD NETWORK FHD¹	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	370	2026-06-11 19:56:16.318574+00
a3b44508-975b-44ee-aa62-bfb6defe3923	E! FHD¹	https://googleplusimages.com/E!.png	https://example.com/stream.m3u8	Variedades/Música	E.br	371	2026-06-11 19:56:16.318574+00
c132e267-7937-460b-a160-e03775e266a6	DISCOVERY THEATER FHD¹	https://googleplusimages.com/DISCOVERYTHEATER.png	https://example.com/stream.m3u8	Documentários	Disctheater.br	372	2026-06-11 19:56:16.318574+00
b66322a3-53a1-4f01-8d08-0fab5b21771f	DISCOVERY SCIENCE FHD¹	https://googleplusimages.com/DISCOVERYSCIENCE.png	https://example.com/stream.m3u8	Documentários	Discscience.br	373	2026-06-11 19:56:16.318574+00
745a6b1c-1d1c-4824-9e18-eb2e380ed231	HGTV FHD¹	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	374	2026-06-11 19:56:16.318574+00
f8fad808-e84e-41c1-a687-5acb72059ec0	CINEMAX FHD¹	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	375	2026-06-11 19:56:16.318574+00
277541f4-3d27-4ee6-90e5-80d1404b35bf	24H OS JETSONS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	425	2026-06-11 19:56:16.425066+00
b442a7cf-aa5a-46f5-b20c-6caa3311c607	CARTOON NETWORK FHD¹	https://googleplusimages.com/CARTOONNETWORK.png	https://example.com/stream.m3u8	Infantil	Cartoonnetwork.br	376	2026-06-11 19:56:16.318574+00
94918e6e-85a8-432c-8c9e-8d373c001f99	SONY CHANNEL FHD¹	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	377	2026-06-11 19:56:16.318574+00
48ce9610-eb6a-4665-9867-747451ff4394	CANAL OFF FHD¹	https://googleplusimages.com/CANALOFF.png	https://example.com/stream.m3u8	Documentários	Off.br	378	2026-06-11 19:56:16.318574+00
304435ac-56cf-48a5-8923-9323223d7bd3	BANDSPORTS FHD¹	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	379	2026-06-11 19:56:16.318574+00
3e2dd769-936d-43a3-b86f-5c5b4d8ed110	AXN FHD¹	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	380	2026-06-11 19:56:16.318574+00
62b95be4-f6df-4acf-9b4d-94636063fb4c	ARTE 1 FHD¹	https://googleplusimages.com/ARTE1.png	https://example.com/stream.m3u8	Documentários	Arte1.br	381	2026-06-11 19:56:16.318574+00
a3616d40-02f9-447f-90ea-9c496abb673e	AMC FHD¹	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	382	2026-06-11 19:56:16.318574+00
51022ce7-9f97-491c-a73b-8b25b1944b2c	A&E FHD¹	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	383	2026-06-11 19:56:16.318574+00
2c551237-0946-4171-a9ac-d45bdba5abf8	TV ASA BRANCA AL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoal.br	384	2026-06-11 19:56:16.318574+00
872b67a4-d811-4842-8dae-423511bc0438	TV ASA BRANCA AL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoal.br	385	2026-06-11 19:56:16.318574+00
b2dc5aef-1d9c-4b26-b4a2-1c369cf52a10	MEGAPIX FHD¹	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	386	2026-06-11 19:56:16.318574+00
eea95bfc-7a6d-4bd9-a1a9-e44328d68a81	ESPN6 HD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn6.br	387	2026-06-11 19:56:16.318574+00
e1b36ca7-3a7b-4206-a58f-db111d293af3	EPTV RIBEIRÃO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	388	2026-06-11 19:56:16.318574+00
81006374-4d3f-4685-8919-00a0a80f5b90	RECORD RIO SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrj.br	389	2026-06-11 19:56:16.318574+00
dceba814-96e6-4fcf-b3a7-b3df1346bef3	TV GAZETA HD¹	https://googleplusimages.com/TVGAZETA.png	https://example.com/stream.m3u8	Abertos	Tvgazetasp.br	390	2026-06-11 19:56:16.318574+00
cc1c3d9f-9af2-44b6-94fd-7ca7441a2c4c	RECORD NEWS HD²	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Abertos	Recordnews.br	391	2026-06-11 19:56:16.318574+00
094b0818-38e3-423e-8dde-822ec787a6e3	ESPN6 HD¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn6.br	392	2026-06-11 19:56:16.318574+00
7f6fe75c-ae98-4f71-b67d-1aa563b9e851	24H Ze Buscape¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	393	2026-06-11 19:56:16.318574+00
9d706e14-6ebb-4cd2-9b1c-f495756bb9e0	24H WALLY GATOR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	394	2026-06-11 19:56:16.318574+00
310a34cd-cfab-45df-b62c-ad8c625c96e1	24H TUTUBARÃO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	395	2026-06-11 19:56:16.318574+00
1f73beb9-a176-4a90-94a7-ec77d90e323f	24H TIMÃO E PUMBA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	396	2026-06-11 19:56:16.318574+00
0a366a97-c7d8-4a58-a296-8820e2ae980a	24H THUNDERCATS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	397	2026-06-11 19:56:16.318574+00
9a8a7443-5ccf-493f-91eb-24eb87b8b5ef	24H THUNDERCATS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	398	2026-06-11 19:56:16.318574+00
13f7fd1a-8fea-4b48-918b-fb9203c8b1b6	24H TELETUBBIES STOP MOTION¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	399	2026-06-11 19:56:16.318574+00
46a9c628-e6c8-4f5d-a9c0-25d678470367	24H TELETUBBIES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	400	2026-06-11 19:56:16.318574+00
17c143fb-bcf9-44d7-b1be-6a0eabe13a4a	24H TAZ O DEMONIO DA TAZMANIA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	401	2026-06-11 19:56:16.425066+00
d972c524-ba1f-494f-9c26-3437ff76575c	24H TARTARUGA TOUCHÉ E DUM DUM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	402	2026-06-11 19:56:16.425066+00
f2812575-ac70-4891-b514-d87a8cd6ad88	SUPER CHOQUE | 24H+	https://googleplusimages.com/SUPERCHOQUE.png	https://example.com/stream.m3u8	Geral	Superchoque.24h	403	2026-06-11 19:56:16.425066+00
68e25e6c-c46b-44f7-863a-d167d29a83d3	24H SPEED RACER - NOVA GERAÇÃO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	404	2026-06-11 19:56:16.425066+00
f080de28-e296-414e-a5a5-06f67c0451a6	24H SPEED RACER¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	405	2026-06-11 19:56:16.425066+00
d7818968-e7cc-480f-8148-90c966e3fbdf	24H SPACE GHOST¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Filmes/Séries	Desenhos.br	406	2026-06-11 19:56:16.425066+00
f71607eb-0206-4b95-95c5-4b6ef06ed672	SOUTH PARK | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	407	2026-06-11 19:56:16.425066+00
5e4bf30a-4157-41e7-93f9-7e2e3d19b719	SHE-RA: A PRINCESA DO PODER | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	408	2026-06-11 19:56:16.425066+00
d284db1b-d4d2-40ea-842e-bb1a825c921e	24H SCOOBY-DOO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	409	2026-06-11 19:56:16.425066+00
a25acef5-069f-4066-a910-9dd7407f737a	24H ROCKET POWER¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	410	2026-06-11 19:56:16.425066+00
c7a5e720-7489-43c2-90e1-03dd5437b7d4	24H RIQUINHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	411	2026-06-11 19:56:16.425066+00
8f7a59b7-944c-4293-a313-102fe37530c0	24H RECRUTA ZERO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	412	2026-06-11 19:56:16.425066+00
e34c1c3e-a08c-49ad-a9bf-716ed2a2729e	24H PROJETO ZETA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	413	2026-06-11 19:56:16.425066+00
a4967ca1-4445-4735-8676-2eddab6f7b6d	POPEYE | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	414	2026-06-11 19:56:16.425066+00
e9a7f2ce-80a5-48d4-9e11-c896fd88edac	24H PINKY E O CÉREBRO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	415	2026-06-11 19:56:16.425066+00
d2d15bf2-504b-49df-8b6c-3bbc1d4bc2c1	24H PICA-PAU²	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	416	2026-06-11 19:56:16.425066+00
c9fd0451-f0c7-453f-a8e8-eb17baf52d0b	24H PICA-PAU¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	417	2026-06-11 19:56:16.425066+00
a46de9ef-f221-4289-9f0d-3e471ed05998	24H PHINEAS E FERB¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	418	2026-06-11 19:56:16.425066+00
84e7cc83-10b9-4dd0-a346-79593798b2a7	24H PEPPA PIG¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	419	2026-06-11 19:56:16.425066+00
0af6f52a-0346-44c7-a3cf-6015799c4c3d	24H PAPA-LÉGUAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	420	2026-06-11 19:56:16.425066+00
a86d37ed-1778-4e36-91e8-4e64f09858f5	24H OS URSINHOS GUMMI¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	421	2026-06-11 19:56:16.425066+00
1788bdf3-0b56-41cb-a943-3d55b5c4f5cf	24H OS SUPER PATOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	422	2026-06-11 19:56:16.425066+00
7a00ed71-c3c9-4d0b-b4f7-b616164fc838	OS PINGUINS DE MADAGASCAR | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	423	2026-06-11 19:56:16.425066+00
c29ad810-e49d-48b5-b81f-19a8db1979a1	24H OS OBLONGS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	424	2026-06-11 19:56:16.425066+00
1bf621c3-bfec-4342-ae88-f9ec61d78354	OS FLINTSTONES | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	426	2026-06-11 19:56:16.425066+00
5d4064ef-b14e-4acd-af25-ea490b2f80bd	24H OS DEBILÓIDES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	427	2026-06-11 19:56:16.425066+00
536a986c-4873-4f80-b3a7-efa6a0d0c836	24H OS CASTORES PIRADOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	428	2026-06-11 19:56:16.425066+00
979530f8-3be6-4e60-8994-599bb928400a	24H OS BACKYARDIGANS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	429	2026-06-11 19:56:16.425066+00
02a7a6ed-6b7c-4bfc-9cfb-010b4b2f021a	24H O XODÓ DA VOVÓ¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	430	2026-06-11 19:56:16.425066+00
e806168a-a9fe-49cf-83a2-27624968fb24	24H O VALE DOS DINOSSAUROS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	431	2026-06-11 19:56:16.425066+00
69f4f449-b1ba-407a-8a9c-25a97255a157	24H O SHOW DO ZE COLMEIA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	432	2026-06-11 19:56:16.425066+00
34709f37-7635-4024-be3e-82eb6e3b04cc	24H O PEQUENO URSO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	433	2026-06-11 19:56:16.425066+00
1e7d7b81-c256-487e-85b8-2ebb3cc8ece8	O PEQUENO SCOOBY-DOO | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	434	2026-06-11 19:56:16.425066+00
d068501f-f6fb-49dc-9b52-30b2e6b9b777	24H O ÔNIBUS MÁGICO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	435	2026-06-11 19:56:16.425066+00
43752724-3e70-4691-a648-cea259665fac	24H O NOVO PICA-PAU¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	436	2026-06-11 19:56:16.425066+00
04cf65c1-e02e-47c0-9726-a45c9b546468	24H O MÁSKARA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	437	2026-06-11 19:56:16.425066+00
1696b2cf-8f56-4d16-9859-32fb42a44671	24H O INSPETOR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	438	2026-06-11 19:56:16.425066+00
2a7c6cee-0444-4ce3-8ba1-43ff3d557d49	24H O INSPETOR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	439	2026-06-11 19:56:16.425066+00
3d39e6df-c282-48ec-9e02-dc760f3ca669	24H O GATO FÉLIX¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	440	2026-06-11 19:56:16.425066+00
b3f86efa-3f20-4339-bd62-34f4d06568a9	24H O ACAMPAMENTO DE LAZLO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	441	2026-06-11 19:56:16.425066+00
778720f5-dba3-4a7e-9b3f-219e594a636a	24H MUCHA LUCHA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	442	2026-06-11 19:56:16.425066+00
5e8d61be-f747-4936-9c3e-a1ae1a48d1be	24H MOSQUETE MOSQUITO E MOSCARDO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	443	2026-06-11 19:56:16.425066+00
54d6cb19-efa3-4f56-a790-7a6c95b3987c	24H MORTAL KOMBAT - OS DEFENSORES DA TERRA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	444	2026-06-11 19:56:16.425066+00
88499d4f-5474-40a7-95cd-332b28152dfb	24H MIB - HOMENS DE PRETO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	445	2026-06-11 19:56:16.425066+00
05c9f833-bd01-4f23-aa2f-78c49b5c6bca	24H MEU MELHOR AMIGO DA ESCOLA É UM MACACO	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	446	2026-06-11 19:56:16.425066+00
36e50000-a275-4d7c-ae13-8c4938556d07	24H MEGAS XLR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	447	2026-06-11 19:56:16.425066+00
fd68471b-76c7-4c77-9b10-66361a276a26	24H MANDA-CHUVA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	448	2026-06-11 19:56:16.425066+00
49d14d8e-0c3e-47ac-9426-3c556b12244e	24H LULUZINHA²	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	449	2026-06-11 19:56:16.425066+00
cca9a851-e724-4aeb-b167-2c7ff24cef37	24H LIGEIRINHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	450	2026-06-11 19:56:16.425066+00
03b9368a-49e1-4bcd-9279-398feed87520	24H KND - A TURMA DO BAIRRO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	451	2026-06-11 19:56:16.425066+00
1489c2d4-7d9f-4e0c-a786-f3a3857ce94b	24H JOSIE E AS GATINHAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	452	2026-06-11 19:56:16.425066+00
89019c2e-e7c7-4d3d-9248-eff76eb1a047	24H JONNY QUEST¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	453	2026-06-11 19:56:16.425066+00
bf6755cc-3010-4026-b9d4-28772307f563	24H JOHNNY BRAVO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	454	2026-06-11 19:56:16.425066+00
38e9a655-055c-4bf8-94bc-db0eb884eeee	24H JAMBO E RUIVÃO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	455	2026-06-11 19:56:16.425066+00
0410c880-1877-4097-901b-acbb429374b8	24H IRMÃO DO JOREL¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	456	2026-06-11 19:56:16.425066+00
cad6c6d8-b4bd-4aa1-aed6-ac5762a88afd	24H INVASOR ZIM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	457	2026-06-11 19:56:16.425066+00
59f03901-82d6-4d78-81cf-947a16b71481	24H ILHA DOS DESAFIOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	458	2026-06-11 19:56:16.425066+00
f2c3a750-a893-46a4-91bb-1665fdc43c6e	24H HOMEM PASSARO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	459	2026-06-11 19:56:16.425066+00
ddf558a5-d8a2-4c88-a8dc-bb8d39fa3dfc	24H GO DIEGO GO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	460	2026-06-11 19:56:16.425066+00
44f39672-9174-4c3a-a807-956363bf0032	GARFIELD E SEUS AMIGOS | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	461	2026-06-11 19:56:16.425066+00
ebaa4d35-9cbc-4e5b-89a1-cb93e4dccfbb	GALINHA PINTADINHA | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	462	2026-06-11 19:56:16.425066+00
57c729ab-8a2b-453c-a106-d4d3fed7cc13	24H FREAKAZOID¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	463	2026-06-11 19:56:16.425066+00
79e9805a-a6ee-456c-8d3c-9076b6011be1	24H OS IMPOSSIVEIS E FRANKENSTEIN JR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	464	2026-06-11 19:56:16.425066+00
7f34cb08-4a93-421a-96b4-3e83b1b9c426	24H FORMIGA ATOMICA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	465	2026-06-11 19:56:16.425066+00
e2f1bd6b-1c42-4587-9a49-a2d914ac6038	24H FABULAS DA DISNEY¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Infantil	Desenhos.br	466	2026-06-11 19:56:16.425066+00
30436eb3-9eee-4431-8dbe-0c80e1be19e9	24H ESQUILO SEM GRILO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	467	2026-06-11 19:56:16.425066+00
42794b4f-cd2a-49bf-9cf9-70bfcde74697	24H EM QUE LUGAR DA TERRA ESTA CARMEN SANDIEGO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	468	2026-06-11 19:56:16.425066+00
021678d2-20cc-4f4f-8905-c5029aaff38e	24H EEK THE CAT¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	469	2026-06-11 19:56:16.425066+00
8d51ad3d-d6a8-4d11-a9d5-905ba4a236c7	24H DOUG¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	470	2026-06-11 19:56:16.425066+00
bcd149b6-a841-4986-be26-c06cdee1dff5	24H DORA - A AVENTUREIRA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	471	2026-06-11 19:56:16.425066+00
bcd2d43e-5188-4ef0-b1f0-c174a75f6e2b	24H DENNIS - O PIMENTINHA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	472	2026-06-11 19:56:16.425066+00
8a5de02c-f73d-4e12-80f5-81ce384c9c58	24H DE VOLTA PARA O FUTURO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	473	2026-06-11 19:56:16.425066+00
da5e8684-0a4e-46cb-b3e2-d970dc1aba00	CORAGEM | 24H+	https://googleplusimages.com/CORAGEM.png	https://example.com/stream.m3u8	Geral	Coragem.24h	474	2026-06-11 19:56:16.425066+00
dc5b75df-0d56-4a1e-a722-93e668aeb5c3	24H CONTOS DA CRIPTA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	475	2026-06-11 19:56:16.425066+00
e07e7d9b-091c-4d3c-abbc-2d8e89d7df9b	24H COELHO RICOCHETE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	476	2026-06-11 19:56:16.425066+00
e59f6e9f-cb2a-4f8a-8292-1a5202912ada	24H CLIFFORD - O GIGANTE CAO VERMELHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	477	2026-06-11 19:56:16.425066+00
b0f081ac-8e4e-474e-bdf4-4ebe8505f465	24H CAVERNA DO DRAGAO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	478	2026-06-11 19:56:16.425066+00
78763913-f751-41df-94c1-446fe80167ba	24H CAPITAO PLANETA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	479	2026-06-11 19:56:16.425066+00
5d64a1e0-a2ff-4475-a332-e5ea1f20eb01	24H CADILLACS E DINOSSAUROS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	480	2026-06-11 19:56:16.425066+00
3c81edb2-d2a7-463e-8e2e-7b1680d9f9d7	24H BUZZ LIGHTYEAR DO COMANDO ESTELAR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	481	2026-06-11 19:56:16.425066+00
0356a859-e934-4df9-94ed-30bc97aad77c	24H BICUDO - O LOBISOMEM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Variedades/Música	Desenhos.br	482	2026-06-11 19:56:16.425066+00
69c08253-ddb6-4138-8810-425b6c27db9d	24H BIBO PAI E BOBI FILHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	483	2026-06-11 19:56:16.425066+00
295d8001-fcec-48d0-9de9-3155f69e1ad2	BEN 10 (2005) | 24H+	https://googleplusimages.com/BEN10.png	https://example.com/stream.m3u8	Geral	Ben10.24h	484	2026-06-11 19:56:16.425066+00
1fa1a919-dcf7-4738-82aa-948deb7b745a	24H AS TRAPALHADAS DE FLAPJACK¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Astrapalhadasdeflapjack.24h	485	2026-06-11 19:56:16.425066+00
4bfd0b27-8f04-42ea-9b0f-2c2e8373bb87	AS TARTARUGAS NINJA	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Astartarugasninja.24h	486	2026-06-11 19:56:16.425066+00
b7a5584d-4b51-4465-85ef-3b1c2a68c8c2	24H GASPARZINHO E SEUS AMIGOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	487	2026-06-11 19:56:16.425066+00
7115fdfd-d30d-440e-81be-380acec44c0c	24H AS MUMIAS VIVAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Variedades/Música	Asmumiasvivas.24h	488	2026-06-11 19:56:16.425066+00
ff1ef0f1-7682-4642-81bc-a69f2694714d	AS MENINAS SUPERPODEROSAS | 24H+	https://googleplusimages.com/MENINASSUPERPODEROSAS.png	https://example.com/stream.m3u8	Geral	Asmeninassuperpoderosas.24h	489	2026-06-11 19:56:16.425066+00
b5ac2f54-40a1-443f-a0c5-3330d36473ad	24H AS AVENTURAS DOS IRMAOS SUPER MARIO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Asaventurasdosirmaossupermario.24h	490	2026-06-11 19:56:16.425066+00
a15fd47f-56af-4afc-88b4-36e0aa5bcf6b	AS AVENTURAS DO GATO DE BOTAS | 24H+	https://googleplusimages.com/GATODEBOTAS.png	https://example.com/stream.m3u8	Geral	Asaventurasdogatodebotas.24h	491	2026-06-11 19:56:16.425066+00
cfb0f0bf-1d9d-405f-b6e7-db7fba3b66fa	24H AS AVENTURAS DE TINTIM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Asaventurasdetintim.24h	492	2026-06-11 19:56:16.425066+00
9aff2b73-7f51-4619-aa23-0f989d34ffa2	24H AS AVENTURAS DE JACKIE CHAN²	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Desenhos.br	493	2026-06-11 19:56:16.425066+00
11592a83-0321-4f4e-aaf8-8de301da5682	ANIMANIACS | 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Animaniacs.24h	494	2026-06-11 19:56:16.425066+00
94078034-8a00-42e1-b172-9991c4e39c9c	24H ANDY PANDA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Andypanda.24h	495	2026-06-11 19:56:16.425066+00
6816742e-aaea-420b-8218-33d955d2ef24	24H ALADDIN¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Aladdin.24h	496	2026-06-11 19:56:16.425066+00
75f52d99-cd08-44b1-ac2b-494470639e17	A VIDA MODERNA DE ROCKO | 24H+	https://googleplusimages.com/ROCKO.png	https://example.com/stream.m3u8	Abertos	Avidamodernaderocko.24h	497	2026-06-11 19:56:16.425066+00
6a218088-0a10-49da-9c82-2c8bbf7f42ee	24H A VACA E O FRANGO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Avacaeofrango.24h	498	2026-06-11 19:56:16.425066+00
afd17a66-000a-4fd4-a07e-1013b5346a75	24H A TURMA DO PATETA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Aturmadopateta.24h	499	2026-06-11 19:56:16.425066+00
e89d9447-3bcb-4ca9-9bcf-55f9662c6417	24H A TURMA DO CHARLIE BROWN¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Aturmadocharliebrown.24h	500	2026-06-11 19:56:16.425066+00
e40727f3-b515-456f-8f37-6d0d7bc8e3b9	24H A PEQUENA SEREIA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Apequenasereia.24h	501	2026-06-11 19:56:16.425066+00
65ff6842-9216-4f5f-b1f4-c2d4ce190696	A PANTERA COR DE ROSA (1978) | 24H+	https://googleplusimages.com/PANTERA.png	https://example.com/stream.m3u8	Geral	Apanteracorderosa.24h	502	2026-06-11 19:56:16.425066+00
9105415c-46b8-486c-aebe-b6577aac390b	24H A NOSSA TURMA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Anossaturma.24h	503	2026-06-11 19:56:16.425066+00
7d2e6229-027d-443a-9563-21aec6af3045	A MANSAO FOSTER PARA AMIGOS IMAGINARIOS | 24H+	https://googleplusimages.com/BLOO.png	https://example.com/stream.m3u8	Geral	AMansaofosterparaamigosimaginarios.24h	504	2026-06-11 19:56:16.425066+00
388558d5-f7e3-4c67-99c2-f7dfe8c4d4bf	A FAMILIA ADDAMS (1973) | 24H+	https://googleplusimages.com/MORTICIA.png	https://example.com/stream.m3u8	Geral	Addamsdesenho1.24h	505	2026-06-11 19:56:16.425066+00
85d80dcb-3d4e-45f4-9cb6-2fca1867a145	A CORRIDA ESPACIAL DO ZÉ COLMEIA	https://googleplusimages.com/ACORRIDAESPACIALDOZECOLMEIA.png	https://example.com/stream.m3u8	Geral	Acorridaespacialdozecolmeia.24h	506	2026-06-11 19:56:16.425066+00
28283bdc-8d4b-46c9-8566-2f51f5592368	A BRUXINHA SABRINA | 24H+	https://googleplusimages.com/ABRUXINHASABRINA.png	https://example.com/stream.m3u8	Geral	Abruxinhasabrina.24h	507	2026-06-11 19:56:16.425066+00
2d27dcf6-46e6-47a4-a5a7-628f55cd6a3f	3 PALAVRINHAS | 24H+	https://googleplusimages.com/3PALAVRINHAS.png	https://example.com/stream.m3u8	Geral	3palavrinhas.24h	508	2026-06-11 19:56:16.425066+00
beebefa2-1f5d-4957-a7fb-b35cae0b6f73	101 DÁLMATAS	https://googleplusimages.com/101DALMATAS.png	https://example.com/stream.m3u8	Geral	101Dalmatas.24h	509	2026-06-11 19:56:16.425066+00
fb3da0c0-3198-4258-81ae-778da9cb6a32	24H ULTRAMAN¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	510	2026-06-11 19:56:16.425066+00
0e2e27cf-cdb8-4424-ac07-e4eb9e935706	24H SHURATO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	511	2026-06-11 19:56:16.425066+00
1c2a9533-fb94-42fe-9f8d-60b90cb3012b	24H SHINZO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	512	2026-06-11 19:56:16.425066+00
9c2e5a01-a93d-462f-9d5f-23fa012a2d5e	24H SHAMAN KING¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	513	2026-06-11 19:56:16.425066+00
3f0cd517-18f1-40bc-a959-d307dbf6ccd9	24H SAMURAI WARRIORS¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	514	2026-06-11 19:56:16.425066+00
88f99b6c-ff7e-420f-a33a-483d8347afe2	24H SAKURA CARD CAPTORS¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	515	2026-06-11 19:56:16.425066+00
8e2d577a-3c90-46bd-81b4-5adc4fdd15b0	24H REDAKAI - DOMÍNIO KAIRU¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	516	2026-06-11 19:56:16.425066+00
3e05cd2c-c5e0-4492-bea1-4390e11fc621	24H POWER STONE¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	517	2026-06-11 19:56:16.425066+00
450d31e8-cc5d-42bc-9ce3-473de473c51f	24H PLANET SURVIVAL¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Variedades/Música	Anime.br	518	2026-06-11 19:56:16.425066+00
d6d16859-8ef9-4004-bb74-ccc400e98c1c	24H PATRULHA ESTELAR¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	519	2026-06-11 19:56:16.425066+00
16eceeef-c563-49d2-9729-008b1d8a9b68	24H OS CAVALEIROS DO ZODÍACO 01 - SAGA DO SANTUÁRIO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	520	2026-06-11 19:56:16.425066+00
f1a3c188-1f6b-4bc1-abbf-7471eacd22b6	24H OS CAVALEIROS DO ZODÍACO 03 - SAGA DE POSEIDON¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	521	2026-06-11 19:56:16.425066+00
9e938ab7-497b-42a3-8bd4-5b32ef993621	24H OS CAVALEIROS DO ZODÍACO 02 - SAGA DE ASGARD¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	522	2026-06-11 19:56:16.425066+00
13709e6c-b0f5-4a8d-ac0a-4405c3f22c28	24H OS CAVALEIROS DO ZODÍACO 02 - SAGA DE ASGARD¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	523	2026-06-11 19:56:16.425066+00
d69d84c9-109c-49d9-9abe-58b9f9e80380	24H OS CAVALEIROS DO ZODÍACO (2)¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	524	2026-06-11 19:56:16.425066+00
3f7710da-96c4-4321-ae5f-43110f14d780	24H MOBILE SUIT GUNDAM WING¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	525	2026-06-11 19:56:16.425066+00
25a34cb5-38c8-4e65-a346-9fb6a0442a23	24H MEDABOTS¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	526	2026-06-11 19:56:16.425066+00
5eaf1fed-500f-4d43-8bdc-e2be0433cd22	24H Jubei-Chan: The Ninja Girl (Legendado)¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	527	2026-06-11 19:56:16.425066+00
4cfc0a33-a71a-47dc-a445-73864b8d9260	24H HAMTARO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	528	2026-06-11 19:56:16.425066+00
a69c675c-7869-4e64-ad68-881d1d9fbacd	24H ESQUADRÃO ESPECIAL WINSPECTOR¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	529	2026-06-11 19:56:16.425066+00
ce80bbf8-1919-492d-998d-fc8c23a99330	24H DON DRACULA¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	530	2026-06-11 19:56:16.425066+00
ae3e8ed4-7536-4fff-9219-05b44a6e9e4a	24H BUCKY¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	531	2026-06-11 19:56:16.425066+00
0376d625-3d1d-477e-a0d5-f3db96e75287	24H BAKUGAN - GUERREIROS DA BATALHA¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	532	2026-06-11 19:56:16.425066+00
ff63d61b-bb02-44ad-827a-ee8a0732d518	24H MANUAL DE SOBREVIVENCIA ESCOLAR DO NED	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	SerieseProgramas.br	533	2026-06-11 19:56:16.425066+00
6f6bcd9d-cf8b-4b6b-ad1e-23012ce8ff1f	DRAKE & JOSH | 24H+	https://googleplusimages.com/DRAKEJOSH.png	https://example.com/stream.m3u8	Geral	Drakejosh.24h	534	2026-06-11 19:56:16.425066+00
b9c69379-1919-4be5-b613-f0d705e6c9d8	A FEITICEIRA | 24H+	https://googleplusimages.com/AFEITICEIRA.png	https://example.com/stream.m3u8	Geral	Afeiticeira.24h	535	2026-06-11 19:56:16.425066+00
61690359-589c-4e6c-b43b-3e1669299d71	24H HÉRCULES¹		https://example.com/stream.m3u8	Geral	SerieseProgramas.br	536	2026-06-11 19:56:16.425066+00
770306be-b1d3-42b2-9aed-33c88b742e30	24H ESCOLINHA DO PROFESSOR RAIMUNDO¹	https://i.imgur.com/CD4EV7r.png	https://example.com/stream.m3u8	Geral	SerieseProgramas.br	537	2026-06-11 19:56:16.425066+00
2aebe7b9-e145-4aa0-89a1-ef176b07e35b	RECORD BAHIA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordba.br	538	2026-06-11 19:56:16.425066+00
73e1050d-47b1-4040-8331-2484fc9dddc6	RECORD BAHIA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordba.br	539	2026-06-11 19:56:16.425066+00
52576d69-b9ac-4e5c-9eca-112f63c17932	CHAPOLIN | 24H+	https://googleplusimages.com/CHAPOLIN.png	https://example.com/stream.m3u8	Geral	Chapolin.24h	540	2026-06-11 19:56:16.425066+00
abc574a4-b2ec-4f3f-bf10-96968e4188ad	24H JUCA BALA E ZE BOLHA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	541	2026-06-11 19:56:16.425066+00
3dc30bf6-4ced-4445-817d-5aa5095bb729	24H POCOYO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	542	2026-06-11 19:56:16.425066+00
f60267d9-e7d5-4417-bee7-be8e667f37fd	24H LOONEY TUNES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	543	2026-06-11 19:56:16.425066+00
20a9bdc9-f98c-49d0-a0b7-31c300c23df1	24H O SHOW DA LUNA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	544	2026-06-11 19:56:16.425066+00
cfb1ac3d-9b0a-4e92-9527-6bb27668af5d	24H LARVA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	545	2026-06-11 19:56:16.425066+00
ff594a8c-4a90-42dc-81a7-9f742dbac4b2	24H GALAXY RANGERS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	546	2026-06-11 19:56:16.425066+00
b1b46d28-a7ce-468b-84f3-106274941bec	24H YU YU HAKUSHO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	547	2026-06-11 19:56:16.425066+00
84b4a2ed-632a-4499-9a64-939ca1145c6b	24H POWER RANGERS 13 - SPD¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	548	2026-06-11 19:56:16.425066+00
db9118dd-51d0-41a5-9b41-44248a34b69e	24H POWER RANGERS 12 - DINO TROVÃO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	549	2026-06-11 19:56:16.425066+00
ef166f13-2617-4922-b0c3-8225195781e8	24H POWER RANGERS 11 - TEMPESTADE NINJA¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	550	2026-06-11 19:56:16.425066+00
25c2e67b-8da3-46ed-83cc-7a4d9334a189	24H POWER RANGERS 07 - GALÁXIA PERDIDA¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	551	2026-06-11 19:56:16.425066+00
b6ea4099-db31-46ae-8ccb-b64b067f326b	24H POWER RANGERS 04 - TURBO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	552	2026-06-11 19:56:16.425066+00
99b8a1fb-48c5-4930-9b83-90ffb6cf0ac6	24H POWER RANGERS 05 - ZEO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	553	2026-06-11 19:56:16.425066+00
f6e06fa9-8532-4730-a077-4340fa52c153	24H POWER RANGERS 03 - MIGHTY MORPHIN ALIEN RANGERS  T3¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	554	2026-06-11 19:56:16.425066+00
06073e3c-4f45-468c-8795-0bed79f5860c	24H POWER RANGERS 03 - MIGHTY MORPHIN ALIEN RANGERS T2	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	555	2026-06-11 19:56:16.425066+00
41b1ffaf-f604-4d1d-b838-2cbe7ba46714	24H POWER RANGERS 03 - MIGHTY MORPHIN ALIEN RANGERS¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	556	2026-06-11 19:56:16.425066+00
7dde61f4-a31c-4b1b-b627-00d3e9648f93	TV SANTA CRUZ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	557	2026-06-11 19:56:16.425066+00
57680cbb-5650-4ad3-9502-e73a3299a55d	TV RIO SUL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvriosul.br	558	2026-06-11 19:56:16.425066+00
5b66cb5a-a3df-4428-8227-e002966c9beb	TV CABO BRANCO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	559	2026-06-11 19:56:16.425066+00
25a88003-5ecd-4ac5-aa01-01d75bebdda2	RBS TV PELOTAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	560	2026-06-11 19:56:16.425066+00
b65dfe38-7c71-4796-b103-2b068e30cf28	RBS TV CAXIAS DO SUL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	561	2026-06-11 19:56:16.425066+00
deb7cc75-e1a2-41ac-8857-754c41485a2f	NSC TV JOINVILLE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	562	2026-06-11 19:56:16.425066+00
961d393c-15d9-4a86-aee9-a405c5ff8fe5	NSC TV BLUMENAU FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	563	2026-06-11 19:56:16.425066+00
da4057d2-135f-4644-a45c-a7029edb75aa	INTERTV SERRA+MAR FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	564	2026-06-11 19:56:16.425066+00
168cd367-cc5b-4a45-8567-3597fcc06ba6	INTERTV GRANDE MINAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	565	2026-06-11 19:56:16.425066+00
73bad864-f168-4bfe-84a8-db3be22f6ae0	INTERTV ALTO LITORAL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	566	2026-06-11 19:56:16.425066+00
98ad1dc4-dfd0-4b82-b37e-5c1f8b8e75a1	TV SANTA CRUZ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	567	2026-06-11 19:56:16.425066+00
d36a3e66-cf99-438f-8eb1-44a0dc5dd740	TV RIO SUL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvriosul.br	568	2026-06-11 19:56:16.425066+00
329e8227-99c9-455c-8b31-5edcc174a1fa	TV CABO BRANCO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	569	2026-06-11 19:56:16.425066+00
255ed390-297c-4cd5-a73e-ebd0805c7fa3	RBS TV PELOTAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	570	2026-06-11 19:56:16.425066+00
1d355529-5070-4d68-8df4-7d4644f407a6	RBS TV CAXIAS DO SUL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	571	2026-06-11 19:56:16.425066+00
cd64d4a8-c124-48bf-8c10-35d89c7ac874	NSC TV JOINVILLE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	572	2026-06-11 19:56:16.425066+00
a1c643ca-de00-46f0-834f-fcbe85b9cfad	NSC TV BLUMENAU HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	573	2026-06-11 19:56:16.425066+00
dea4837d-d75f-4e71-a166-a8b4e323e65b	INTERTV SERRA+MAR HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	574	2026-06-11 19:56:16.425066+00
08f516ef-2619-40b9-afb1-5d3f7d923bd8	INTERTV GRANDE MINAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	575	2026-06-11 19:56:16.425066+00
13d6985f-38ce-476c-8e87-a2909582a6ec	INTERTV ALTO LITORAL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	576	2026-06-11 19:56:16.425066+00
86d88fc7-555c-4b90-b9fa-4deeda59a53e	TV CULTURA FHD¹	https://googleplusimages.com/CULTURA.png	https://example.com/stream.m3u8	Abertos	Tvcultura.br	577	2026-06-11 19:56:16.425066+00
fa91227f-a60c-41d6-900a-e3f25d155eec	REDETV! SP FHD¹	https://googleplusimages.com/BA42JzV.png	https://example.com/stream.m3u8	Abertos	Redetvsp.br	578	2026-06-11 19:56:16.425066+00
90a5dd86-306f-48d1-96a9-9810f17219c6	REDE VIDA HD¹	https://i.imgur.com/PFjpu5s.png	https://example.com/stream.m3u8	Abertos	Redevida.br	579	2026-06-11 19:56:16.425066+00
a0162098-647a-48e7-b988-d4d76a0e690e	(+18) 24H WOW PORN¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	580	2026-06-11 19:56:16.425066+00
ace2bdda-644a-4c69-a930-680934ca73fb	(+18) 24H FLAGRAS¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	581	2026-06-11 19:56:16.425066+00
be98ef52-f957-4dc8-8379-9c483a1445d4	(+18) 24H BRAZZERS¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	582	2026-06-11 19:56:16.425066+00
a6e96ee9-698a-4c67-a85f-5adba57c1847	(+18) 24H A CASA DAS BRASILEIRINHAS PACK 4¹	https://i.imgur.com/oE9iABK.png	https://example.com/stream.m3u8	Adulto	Adultos.br	583	2026-06-11 19:56:16.425066+00
ce54ca56-fd99-41fd-b26c-d8031f02cb7b	(+18) 24H A CASA DAS BRASILEIRINHAS PACK 3¹	https://i.imgur.com/oE9iABK.png	https://example.com/stream.m3u8	Adulto	Adultos.br	584	2026-06-11 19:56:16.425066+00
d84306a6-333a-42a8-ba2c-1f65c25e5e80	(+18) 24H A CASA DAS BRASILEIRINHAS PACK 2	https://i.imgur.com/oE9iABK.png	https://example.com/stream.m3u8	Adulto	Adultos.br	585	2026-06-11 19:56:16.425066+00
af8235c6-92e6-4c51-b538-1c7c0388a00d	(+18) 24H A CASA DAS BRASILEIRINHAS PACK 1¹	https://i.imgur.com/oE9iABK.png	https://example.com/stream.m3u8	Adulto	Adultos.br	586	2026-06-11 19:56:16.425066+00
903c957d-9e24-438c-8feb-595d5fd8c2ce	POLISHOP TV HD²	https://googleplusimages.com/POLISHOP.png	https://example.com/stream.m3u8	Geral	Polishop.br	587	2026-06-11 19:56:16.425066+00
391e7d25-4145-4fee-8ea7-12fc83e2c16b	24H URSINHOS CARINHOSOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	588	2026-06-11 19:56:16.425066+00
6c074a66-2240-44c3-9ba0-d84bfe616733	24H TOPO GIGIO (1987)¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	589	2026-06-11 19:56:16.425066+00
ab8b499c-8d93-4c76-9b34-79f7bdce916e	24H TOM & JERRY²	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	590	2026-06-11 19:56:16.425066+00
cf46a9d3-8394-4b6c-acde-24c09caa0e45	24H TITIO AVO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	591	2026-06-11 19:56:16.425066+00
c5a5fb34-f631-4f3f-ae1f-4353ac09476f	24H TITA SIMBIONICO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	592	2026-06-11 19:56:16.425066+00
a6872926-bbf2-438a-a867-978bbc1339da	24H TIMÃO E PUMBA²	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	593	2026-06-11 19:56:16.425066+00
2edd5d99-8a44-49c3-9677-24d754da1d7c	24H THOMAS E SEUS AMIGOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	594	2026-06-11 19:56:16.425066+00
7cdbbb9f-cc98-48aa-8fac-d3819d368e0c	24H SUPER AMIGOS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	595	2026-06-11 19:56:16.425066+00
f06e2f2c-4882-4d60-bcf9-240576ffbdb2	24H SONIC X¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	596	2026-06-11 19:56:16.425066+00
f75f9b37-4129-43c5-bf21-88981270e45e	24H SONIC BOOM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	597	2026-06-11 19:56:16.425066+00
45757059-24dd-4bcc-9d2b-3c8a1cd12b05	24H SCOOB DOO SHOW¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	598	2026-06-11 19:56:16.425066+00
aba6552e-1776-46ed-83aa-d0ff6e7b15f2	24H SAGWA A GATINHA SIAMESA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	599	2026-06-11 19:56:16.425066+00
69033ecc-11f1-49f5-b623-0d6c0c9e6834	24H REN E STIMPY¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	600	2026-06-11 19:56:16.425066+00
90304d21-bf73-49bb-ad91-00fb4e0ddddc	24H PERDIDO NAS ESTRELAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	601	2026-06-11 19:56:16.52403+00
884279be-8f88-48ee-b621-72484db53880	24H PEPE LE PEW¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	602	2026-06-11 19:56:16.52403+00
deba45f1-11d7-45cc-a9ac-813a16ab5b4b	24H OSWALDO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	603	2026-06-11 19:56:16.52403+00
ae6ecc71-e692-46f2-a1e8-1eb43b28f7ae	24H OS VINGADORES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	604	2026-06-11 19:56:16.52403+00
2f92e127-9993-4bc7-99ab-0e9f05617bf1	24H OS IMPOSSIVEIS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	605	2026-06-11 19:56:16.52403+00
707bbdba-38ab-4b5a-9eb2-de58333cb7aa	24H O SEGREDO ALEM DO JARDIM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	606	2026-06-11 19:56:16.52403+00
a22e1e7a-5d97-424a-a629-7240d2638790	24H O PEQUENO PRINCIPE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	607	2026-06-11 19:56:16.52403+00
20e0139c-c6c0-44cd-9675-ca426e8f8415	24H O FANTASTICO MUNDO DE BOBBY²	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	608	2026-06-11 19:56:16.52403+00
1c7b9bb7-9f4d-4820-987d-979e7faf219e	24H NOVO BANANA DE PIJAMAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	609	2026-06-11 19:56:16.52403+00
ce3cfca1-243c-4f05-9be8-52156b446578	24H MOBY DICK¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	610	2026-06-11 19:56:16.52403+00
a8bea6a0-3d7d-4dd0-8fce-0098f84076f5	24H MECANIMAIS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	611	2026-06-11 19:56:16.52403+00
02ea6c09-ef0f-4083-9378-e28f16a87ae7	24H MATRACATRICA E FOFOQUINHA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	612	2026-06-11 19:56:16.52403+00
de24e6ba-786d-49a6-8877-8de85ea009ec	24H MARCELINO PAO E VINHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	613	2026-06-11 19:56:16.52403+00
0da21cf8-4a8a-41d4-a759-c780b36eacee	24H MADELINE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	614	2026-06-11 19:56:16.52403+00
d279a6c5-cbd9-4a98-bd7b-8f90fa096bec	24H LORDE GATO E A TURMA DO ABOBRINHA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	615	2026-06-11 19:56:16.52403+00
c7153aa1-c4b7-4388-9180-ce0435bc8f90	24H LIPPY E HARDY¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	616	2026-06-11 19:56:16.52403+00
368196ab-1668-4d82-84fd-4e2bc0b30a76	24H KIM POSSIBLE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	617	2026-06-11 19:56:16.52403+00
464afe57-fe58-4186-a9b5-8eab09738b4b	24H MARVEL - HOMEM ARANHA: ACAO SEM LIMITES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	618	2026-06-11 19:56:16.52403+00
a9fd2e9f-b7de-4621-bf1c-01f1b521114a	24H HISTORINHAS DE DRAGOES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	619	2026-06-11 19:56:16.52403+00
c7f86ad9-1b78-47e8-b91e-8db95ad9f2cd	24H FANTASMINO - O FANTASMA GALOPANTE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	620	2026-06-11 19:56:16.52403+00
0f153b29-0805-41da-a1ba-530d7eb7daf8	24H FANTASMINHA LEGAL¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	621	2026-06-11 19:56:16.52403+00
8cc0da0b-0480-4d25-9a2e-b545685c80dc	24H DINAMITE - O BIONICAO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	622	2026-06-11 19:56:16.52403+00
d803ee36-a4ca-4f8d-9c3c-b7d73d839b8e	24H FAISCA E FUMACA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	623	2026-06-11 19:56:16.52403+00
3729bacc-fcfa-43e8-8b7f-3c074a9f157b	24H ESQUADRAO MARTE¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	624	2026-06-11 19:56:16.52403+00
b365bb12-f3f8-4a33-9376-12effdd45eea	24H ESQUADRAO DO TEMPO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	625	2026-06-11 19:56:16.52403+00
4560125c-5fc7-4e76-b189-0f4890b1b870	24H E O LOBO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	626	2026-06-11 19:56:16.52403+00
9a50727c-edd9-4e68-a02f-b3e65234a977	24H DUELO SHAOLIN¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	627	2026-06-11 19:56:16.52403+00
dad1c333-a4bf-451f-a73c-ba69d3cb38ce	24H DUDLEY CERTINHO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	628	2026-06-11 19:56:16.52403+00
68d55c0f-2f3c-4a17-bf59-079283a67486	24H DROPPY¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	629	2026-06-11 19:56:16.52403+00
10eb566e-72c7-47b8-b81c-f776a370f50c	24H DR CALCA DIMENSIONAL¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	630	2026-06-11 19:56:16.52403+00
644c4d2e-6eff-4a50-83fc-c2ff1f8ab042	24H DICK VIGARISTA E MUTTLEY¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	631	2026-06-11 19:56:16.52403+00
49a9e49c-7e56-48b6-9471-ee641f6558e1	24H CYBERCHASE - A CORRIDA DO ESPACO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	632	2026-06-11 19:56:16.52403+00
48406bda-7ba2-491c-a000-d2359ae00ca2	24H CLUBE DOS CARROS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	633	2026-06-11 19:56:16.52403+00
b911e8ba-ce34-4d44-afea-336d836c6226	24H CLARENCIO - O OTIMISTA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	634	2026-06-11 19:56:16.52403+00
61f27176-8d2a-45bb-ae2e-2c51c55bbd4d	24H CHOWDER¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	635	2026-06-11 19:56:16.52403+00
00e3aa6e-b708-4df2-8a17-850f6ff666d2	24H CENTURIONS - FORCA EXTREMA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	636	2026-06-11 19:56:16.52403+00
ffffbc7d-0a75-42fe-bbf5-4fff5d65a149	24H CAMPEOES DO SENDOKAI¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	637	2026-06-11 19:56:16.52403+00
43178cdb-44cf-46f0-ba96-9d9d989542be	24H OS CÃEZINHOS DO CANIL¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	638	2026-06-11 19:56:16.52403+00
48c27260-0f25-40e6-a9a5-f8c6559e7d3b	24H BRAVESTARR¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Filmes/Séries	Desenhos.br	639	2026-06-11 19:56:16.52403+00
f0502d81-4742-43dc-a38c-8e31abd8cd49	24H BONECO ATOMICO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	640	2026-06-11 19:56:16.52403+00
f888b66d-df53-4a11-ac14-213f6d6cad41	24H AS TRIGEMIAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Astrigemeas.24h	641	2026-06-11 19:56:16.52403+00
33c7b9d3-1e01-4710-9d1c-ca9bf6ac32bd	24H ARQUIVO CAOFIDENCIAL¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Arquivocaofidencial.24h	642	2026-06-11 19:56:16.52403+00
48d61831-a7c9-4583-a80a-7bbff2343d78	24H ACAMPAMENTO LAKEBOTTOM¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Acampamentolakebottom.24h	643	2026-06-11 19:56:16.52403+00
e74eb0af-6df3-4029-af1d-8e25f20ebe19	24H A MUMIA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Amumia.24h	644	2026-06-11 19:56:16.52403+00
5a4f8a3b-90e9-4f8e-ad0f-25ff5246d9a9	24H A FEITICEIRA FACEIRA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Afeiticeirafaceira.24h	645	2026-06-11 19:56:16.52403+00
a29c337c-ab40-43bc-8e26-5b58b85c9588	A FAMILIA DRACULA | 24H+	https://googleplusimages.com/DRAK.png	https://example.com/stream.m3u8	Geral	Afamiliadracula.24h	646	2026-06-11 19:56:16.52403+00
0b0c0783-9e7d-483f-bcfa-3f53d3282a74	A COBRINHA AZUL	https://googleplusimages.com/ACOBRINHAAZUL.png	https://example.com/stream.m3u8	Geral	Acobrinhaazul.24h	647	2026-06-11 19:56:16.52403+00
08dd1803-8345-4afc-927a-0e1b36fdf7b7	24H CRANE - A CEGONHA PERNA FINA¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	648	2026-06-11 19:56:16.52403+00
dfc3c117-320c-4c17-9d35-968d1db7e9b9	24H ZATCH BELL¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	649	2026-06-11 19:56:16.52403+00
effe457b-445c-47f8-b25b-1eb274f3a516	24H YU-GI-OH CLASSICO T05¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	650	2026-06-11 19:56:16.52403+00
214c00ea-700d-4f95-9ee3-0ebf64f8869a	24H YU-GI-OH CLASSICO T04¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	651	2026-06-11 19:56:16.52403+00
e746b843-1a1a-4b4c-914c-602e83ea06cb	24H YU-GI-OH CLASSICO T03¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	652	2026-06-11 19:56:16.52403+00
a9011de6-9811-4a09-8fa2-888880334f99	24H YU-GI-OH CLASSICO T02	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	653	2026-06-11 19:56:16.52403+00
8a3d96ee-67b9-47e6-83f0-4f9b68db41a0	24H YU-GI-OH CLASSICO T01¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	654	2026-06-11 19:56:16.52403+00
3199a3c9-301c-4cdd-a211-2f334aa744e9	24H SAMURAI CHAMPLOO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	655	2026-06-11 19:56:16.52403+00
ce3503e7-6351-49c0-9ac7-17804fb5c91d	24H ZILLION¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	656	2026-06-11 19:56:16.52403+00
19ffef35-9845-441b-8297-89a22db89b3e	24H GUERREIRAS MAGICAS DE RAYEARTH¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	657	2026-06-11 19:56:16.52403+00
ec510e00-b9ec-42b6-8e36-26f740332a3d	24H FLY O PEQUENO GUERREIRO¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	658	2026-06-11 19:56:16.52403+00
b0736390-924f-4f55-96e1-216116f9edde	24H PATLABOR¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	659	2026-06-11 19:56:16.52403+00
d1ac9ec4-4b65-4557-9336-e7457e0f777d	24H RAGNAROK¹	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	660	2026-06-11 19:56:16.52403+00
fd798a0b-bc27-46ae-b65e-9e7e5f3d113f	CANÇÃO NOVA INTERNACIONAL	https://googleplusimages.com/CANCAONOVAPT.png	https://example.com/stream.m3u8	Geral	CANCAONOVA.pt	661	2026-06-11 19:56:16.52403+00
343863b0-9020-49f5-880a-e72a33ab961d	SPORT·TV NBA HD	https://i.imgur.com/Nn4ovV6.png	https://example.com/stream.m3u8	Geral	NBA.pt	662	2026-06-11 19:56:16.52403+00
6b51355c-a048-46b4-b74e-e0b1ca8fdb73	RECORD NEWS INTERNACIONAL SD	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Abertos	RecordNews.pt	663	2026-06-11 19:56:16.52403+00
7bf09286-e3e1-4c15-a553-04d7465c0b4d	RBS TV PORTO ALEGRE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	664	2026-06-11 19:56:16.52403+00
998a7a5e-4c39-437f-8091-dd33090fd2bf	24H LEO O CAMINHÃO¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	665	2026-06-11 19:56:16.52403+00
743dba61-b96b-4117-a6fe-349936aaf20a	24H PEGADINHAS DA REDETV!¹		https://example.com/stream.m3u8	Abertos	SerieseProgramas.br	666	2026-06-11 19:56:16.52403+00
86bc2a51-93ef-490d-a4f8-e5e496afd633	24H YOUTUBE - FATOS DESCONHECIDOS¹	https://i.imgur.com/zgYJDz7.png	https://example.com/stream.m3u8	Geral	SerieseProgramas.br	667	2026-06-11 19:56:16.52403+00
4b312082-a23c-411e-8c5b-af6feb1d2b82	(+18) 24H TESTE DE FUDELIDADE¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	668	2026-06-11 19:56:16.52403+00
ed730741-d06f-4040-9b8b-f4030c418852	(+18) 24H GOZO¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	669	2026-06-11 19:56:16.52403+00
117cbd93-5e14-496f-9cd1-82af53fce1df	(+18) 24H LOIRAS¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	670	2026-06-11 19:56:16.52403+00
a5deec6c-39bd-4756-8e6c-d229e73257a8	(+18) 24H TRANSEXUAL¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	671	2026-06-11 19:56:16.52403+00
3419e228-7244-47f5-8d9f-c60d409ba322	(+18) 24H AMADOR¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	672	2026-06-11 19:56:16.52403+00
3f0f513c-87ce-49b1-ac6b-de1ccf6620b4	(+18) 24H ANAL¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	673	2026-06-11 19:56:16.52403+00
a1e1a7d1-6581-43d5-87ec-8a6689844f65	(+18) 24H BRASILEIRAS¹	https://googleplusimages.com/BRASILEIRAS.png	https://example.com/stream.m3u8	Adulto	Adultos.br	674	2026-06-11 19:56:16.52403+00
e5ac0ba1-ac3b-48a5-a909-ef165bee6402	(+18) 24H HENTAI¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	675	2026-06-11 19:56:16.52403+00
71222218-4e6b-4110-881c-1404a28a8c7b	(+18) 24H LÉSBICAS¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	676	2026-06-11 19:56:16.52403+00
d11a2282-f96a-4cbf-bbba-d5a4dd8918c2	(+18) 24H MIA KHALIFA¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	677	2026-06-11 19:56:16.52403+00
adad2c87-18e0-4883-9c51-8fbcaa733c4e	(+18) 24H GAY¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	678	2026-06-11 19:56:16.52403+00
9c5ee710-f9b1-435d-bf50-281ef8685540	(+18) 24H RUIVAS¹	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	679	2026-06-11 19:56:16.52403+00
1da4e7fc-1aef-4459-ae98-4fb60ec53b97	CNN BRASIL FHD¹	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	680	2026-06-11 19:56:16.52403+00
967d7803-d0af-4809-bcc8-ada9ac3472bc	CNN BRASIL HD¹	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	681	2026-06-11 19:56:16.52403+00
35a0fffa-009c-459b-89ff-c5ce04253e90	CNN BRASIL SD¹	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	682	2026-06-11 19:56:16.52403+00
e046d851-cc37-487c-b216-ee374e83b68e	RPC MARINGÁ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	683	2026-06-11 19:56:16.52403+00
e3c05d5b-0ffb-4dde-af11-44e59cf5d61f	RPC MARINGÁ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	684	2026-06-11 19:56:16.52403+00
8bbbaf79-c380-4e6e-a3c7-dd31514caa14	RECORD BRASÍLIA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recorddf.br	685	2026-06-11 19:56:16.52403+00
36c112d1-c31b-4c17-b46e-ae2eb856b523	GLOBO BRASÍLIA H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globodf.br	686	2026-06-11 19:56:16.52403+00
c3346bbb-f8cd-465c-9524-fbf2373f96b3	SBT BRASILIA HD²	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtdf.br	687	2026-06-11 19:56:16.52403+00
ca14188e-0dba-4a69-a343-6dad756bba1d	TV VERDES MARES HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	688	2026-06-11 19:56:16.52403+00
175b5917-ebec-45d6-85ff-9b36532098da	TV EVANGELIZAR HD²	https://i.imgur.com/CDFS1c9.png	https://example.com/stream.m3u8	Geral	Tvevangelizar.br	689	2026-06-11 19:56:16.52403+00
5d4981a2-c74e-412d-bc13-71d6e3dc242d	TV TEM SOROCABA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	690	2026-06-11 19:56:16.52403+00
d9c99f92-d065-4fcf-8a63-ebfc3b9f8584	TV RÁ TIM BUM HD²	https://googleplusimages.com/TVRaTIMBUM.png	https://example.com/stream.m3u8	Geral	Tvratimbum.br	691	2026-06-11 19:56:16.52403+00
15596e19-1f1e-426c-af1e-3831cd00b7f7	TV CAMARA FHD¹	https://i.ibb.co/wRmCCDg/TVCAMARA.png	https://example.com/stream.m3u8	Geral	Tvcamara.br	692	2026-06-11 19:56:16.52403+00
6afb9032-a3e6-4ab8-99df-b8c636c1f699	TLC H265¹	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	693	2026-06-11 19:56:16.52403+00
ac66e72e-a69b-4dda-8df2-5bede77e011a	USA NETWORK H265¹	https://googleplusimages.com/USANETWORK.png	https://example.com/stream.m3u8	Geral	Usa.br	694	2026-06-11 19:56:16.52403+00
d1493b0c-5161-421f-a36f-8be64fa1ee9d	REDETV! SP H265²	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Abertos	Redetvsp.br	695	2026-06-11 19:56:16.52403+00
f25ba8f0-1997-4833-92f1-d166dbed19d7	HISTORY 2 H265¹	https://i.imgur.com/JOmLdYI.png	https://example.com/stream.m3u8	Documentários	History2.br	696	2026-06-11 19:56:16.52403+00
91dad73a-1e37-4a11-9064-23b4c635e316	HBO POP H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	697	2026-06-11 19:56:16.52403+00
53a7590e-0a1d-4a6a-84bd-cbd7525d7c36	HBO XTREME H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	698	2026-06-11 19:56:16.52403+00
18bed01c-64cf-410b-b630-9c5c2063654e	HBO MUNDI H265¹	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	699	2026-06-11 19:56:16.52403+00
78907833-986a-4291-88d2-9a64347cf4ab	GLOOB H265¹	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	700	2026-06-11 19:56:16.52403+00
d16b21e4-3883-4306-9113-b5d4914953b9	REDE AMAZÔNICA MANAUS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	701	2026-06-11 19:56:16.52403+00
888cde37-157c-49af-9b86-32dcfcfc93bb	TV MIRANTE SÃO LUÍS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	702	2026-06-11 19:56:16.52403+00
50caf7e1-d5d2-424c-aa9d-f241d3758609	TV ASA BRANCA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Asabranca.br	703	2026-06-11 19:56:16.52403+00
9bfad568-42cf-46e2-b0b7-22389e49e57a	CNN BRASIL HD²	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	704	2026-06-11 19:56:16.52403+00
5faeaea5-64d7-43ff-bf0a-463d302ef7c5	CNN BRASIL H265¹	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	705	2026-06-11 19:56:16.52403+00
8ece7e65-7a05-4e99-9688-4adef0fc5d65	TV ARATU HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtba.br	706	2026-06-11 19:56:16.52403+00
d0f08881-362b-41e7-8b17-df52c525056f	(+18) PLAYBOY TV FHD¹	https://googleplusimages.com/PLAYBOYTV.png	https://example.com/stream.m3u8	Adulto	Playboytv.br	707	2026-06-11 19:56:16.52403+00
20fa7e6c-3c80-43bb-9ca7-e47ce95f887e	NSC TV FLORIANÓPOLIS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	708	2026-06-11 19:56:16.52403+00
86264dc3-ed4c-4fdb-b1da-e1609dea1cb0	TV ANHANGUERA GOIÂNIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	709	2026-06-11 19:56:16.52403+00
c8411aef-7f4f-4ad8-bb18-a21c3de81461	REDE VIDA SD¹	https://i.imgur.com/PFjpu5s.png	https://example.com/stream.m3u8	Abertos	Redevida.br	710	2026-06-11 19:56:16.52403+00
82d1b8ed-1ac2-46db-92d7-68400c726597	ESPN2 H265¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	711	2026-06-11 19:56:16.52403+00
5c8dee8e-c158-44fb-84f3-f3bcc46c0c4d	CANAL RURAL HD²	https://i.imgur.com/rWpvcdP.png	https://example.com/stream.m3u8	Geral	Canalrural.br	712	2026-06-11 19:56:16.52403+00
54302bd2-115b-41a2-8b04-6ff060c07e8b	INVESTIGAÇÃO DISCOVERY SD¹	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	713	2026-06-11 19:56:16.52403+00
5defe352-240f-4ef5-8be3-10800c125aa7	GLOBO SP H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	714	2026-06-11 19:56:16.52403+00
a1e717e1-a955-4f56-b824-14806ab8671b	BANDNEWS TV H265²	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	715	2026-06-11 19:56:16.52403+00
b99857b3-bbe7-408f-92a8-2fcb9e687bd1	RECORD GOIÁS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordgo.br	716	2026-06-11 19:56:16.52403+00
352c8259-efa1-4d2f-a87b-b0bfab7323f4	RECORD GOIÁS HD+	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordgo.br	717	2026-06-11 19:56:16.52403+00
05ad1a76-1f64-4143-92f5-f56223617ad4	RECORD GUAÍBA RS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrs.br	718	2026-06-11 19:56:16.52403+00
1089747a-5e53-4288-8941-a514a42035dd	RECORD INTERIOR SP HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordintsp.br	719	2026-06-11 19:56:16.52403+00
7cf2414f-ee9e-4824-983a-7658d0afa6d2	RECORD BELÉM HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordpa.br	720	2026-06-11 19:56:16.52403+00
cf3d7f72-9908-44fc-9456-b2fe2062cfd4	RECORD LITORAL E VALE HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordlitoralvale.br	721	2026-06-11 19:56:16.52403+00
0488269a-a29b-445b-b403-ea664741551b	RECORD MINAS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordmg.br	722	2026-06-11 19:56:16.52403+00
821b2d43-85ec-4b46-8359-1152404bc0e9	RECORD RIO HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrj.br	723	2026-06-11 19:56:16.52403+00
50cade2b-34b5-4d45-b91a-afaddfefd299	RECORD MANAUS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	724	2026-06-11 19:56:16.52403+00
a1bf36b9-8661-4995-acab-bddb50bc170f	RPC PONTA GROSSA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	725	2026-06-11 19:56:16.52403+00
f714fa36-c9aa-4457-8371-b41e7a593db5	RPC PONTA GROSSA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	726	2026-06-11 19:56:16.52403+00
3258eb8c-dfb7-49ef-b491-9b02bfc305d5	EPTV SUL DE MINAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvmg.br	727	2026-06-11 19:56:16.52403+00
6266af94-595a-4161-a09c-bc6cc98b967e	TV ASA BRANCA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Asabranca.br	728	2026-06-11 19:56:16.52403+00
ae727736-5986-4e77-914d-fce487b47230	NSC TV CRICIÚMA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	729	2026-06-11 19:56:16.52403+00
a961df44-b548-4547-b0ca-7d699c4fdd74	NSC TV CHAPECÓ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	730	2026-06-11 19:56:16.52403+00
3b34632f-3ecc-4207-a969-8f92b6f38a19	NSC TV CHAPECÓ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	731	2026-06-11 19:56:16.52403+00
7c515d6f-1161-4339-95e9-05e8756071c8	TV ALTEROSA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtmg.br	732	2026-06-11 19:56:16.52403+00
a396cbd5-2837-45d1-a381-eba7d6e4b9c0	TV JANGADEIRO HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtce.br	733	2026-06-11 19:56:16.52403+00
d5f430a7-9228-45eb-881d-f7e59bcfc431	TV CENTRO AMÉRICA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	734	2026-06-11 19:56:16.52403+00
3bef69b4-cbc3-4f10-94da-05e44d8fd3b4	TV CENTRO AMÉRICA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	735	2026-06-11 19:56:16.52403+00
974893f5-84ba-4cea-b6ee-0c58f9fd08cf	TV VERDES MARES HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	736	2026-06-11 19:56:16.52403+00
6fe019e3-7023-4af4-b5bf-65bb83b0d57a	TV VERDES MARES FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	737	2026-06-11 19:56:16.52403+00
796aa39d-81cf-4018-8943-4b532173727d	REDE AMAZÔNICA MANAUS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoap.br	738	2026-06-11 19:56:16.52403+00
39690876-4a6c-4013-8684-8f6b948e611b	REDE AMAZÔNICA MANAUS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	739	2026-06-11 19:56:16.52403+00
96e467f7-b7d4-454f-b437-f482327e7d82	TV LIBERAL BELÉM HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	740	2026-06-11 19:56:16.52403+00
53266698-2dbb-4b40-b026-3359778d7eaa	TV LIBERAL BELÉM FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	741	2026-06-11 19:56:16.52403+00
efb9a6c0-d448-4db2-b589-48aa6f47be67	[UK] SKY NEWS SD	https://i.imgur.com/GsV1P3H.png	https://example.com/stream.m3u8	Geral	SkyNews.uk	742	2026-06-11 19:56:16.52403+00
368b713b-4682-496a-a8c8-ef345d7db5d1	EPTV RIBEIRÃO SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	743	2026-06-11 19:56:16.52403+00
87fe91af-00c4-4576-a3fa-680fa6d13557	EPTV SUL DE MINAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvmg.br	744	2026-06-11 19:56:16.52403+00
ef7010a0-8094-47c1-9801-9bc7eb5841cd	TV SERGIPE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globose.br	745	2026-06-11 19:56:16.52403+00
c5062680-23be-4371-b244-bcbec6d77c82	BAND BAHIA HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandba.br	746	2026-06-11 19:56:16.52403+00
4dcbebbd-c5ca-4590-bc0d-1b2890bf463f	BAND RIO HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandrj.br	747	2026-06-11 19:56:16.52403+00
4a5d4e77-5773-4625-ad80-5f08f05b59e6	BAND RS HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandrs.br	748	2026-06-11 19:56:16.52403+00
64c4b868-a32e-4db1-ab66-17c811c3772d	SBT RS HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtrs.br	749	2026-06-11 19:56:16.52403+00
e41bc735-3c2e-4d6f-8c5b-4f1b310e03b2	TV TAMBAU HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpb.br	750	2026-06-11 19:56:16.52403+00
e2ab5c81-0d51-4a6e-9b2e-de32133656ea	TV TEM ITAPETININGA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	751	2026-06-11 19:56:16.52403+00
ef996e6b-e247-4592-9a39-e85f0968e176	TV TEM ITAPETININGA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	752	2026-06-11 19:56:16.52403+00
2e3f2ff6-2d10-44ce-8aa5-bdaf82a1eea1	REDE AMAZÔNICA BOA VISTA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globorr.br	753	2026-06-11 19:56:16.52403+00
c937265d-ac0c-4164-930e-7b41eeba8361	REDE AMAZÔNICA PORTO VELHO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	754	2026-06-11 19:56:16.52403+00
ea24087d-badf-423b-995a-4484ce77be0a	REDE AMAZÔNICA PORTO VELHO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	755	2026-06-11 19:56:16.52403+00
bf3dbf2a-d19d-479d-aa3e-63f3c1914607	TV INTEGRAÇÃO UBERLÂNDIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	756	2026-06-11 19:56:16.52403+00
874fe323-9a0d-44f3-b226-80f7c10bef19	TV DIÁRIO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvdiariosp.br	757	2026-06-11 19:56:16.52403+00
d26095df-1c0f-459f-8cb9-fabd012f5008	TV DIÁRIO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvdiariosp.br	758	2026-06-11 19:56:16.52403+00
eafd3768-7f97-41cc-b366-aa2c7fe85efd	TV NOVO TEMPO SD¹	https://googleplusimages.com/TVNOVOTEMPO.png	https://example.com/stream.m3u8	Geral	Tvnovotempo.br	759	2026-06-11 19:56:16.52403+00
a47f2efe-37c3-4cfb-84a7-0ec11c6f75e9	LIVE - FLA TV HD	https://i.imgur.com/S0fZvY9.png	https://example.com/stream.m3u8	Geral	LiveClubes.br	760	2026-06-11 19:56:16.52403+00
f53cf091-6f02-4247-84b8-8640fcb00557	TV TERCEIRO ANJO HD	https://i.imgur.com/AzTGXHk.png	https://example.com/stream.m3u8	Geral	Ausente.br	761	2026-06-11 19:56:16.52403+00
5e7a1473-217d-4e05-a357-07b302068263	BANDNEWS TV HD²	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	762	2026-06-11 19:56:16.52403+00
ce854edc-87f2-4a2e-94ce-572340564324	TH+ SBT VALE FHD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	763	2026-06-11 19:56:16.52403+00
606858ae-54d5-4e74-af45-d260eace2404	(+18) SEXY HOT HD²	https://i.imgur.com/ZyDarZ6.png	https://example.com/stream.m3u8	Adulto	Sexyhot.br	764	2026-06-11 19:56:16.52403+00
11143cf0-54cb-4adb-8dad-65062a88ba3e	(+18) 24H BRASILEIRAS 02	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	765	2026-06-11 19:56:16.52403+00
0da5a94f-bdaa-4cea-b4bf-c3af24eec8de	(+18) 24H GOZO 02	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	766	2026-06-11 19:56:16.52403+00
6f9d0b5b-975c-48af-acb4-4e5385bd7f86	(+18) 24H RUIVAS 02	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Adulto	Adultos.br	767	2026-06-11 19:56:16.52403+00
37d0c5e3-6c95-4d48-898a-73356797101b	CANAL BRASIL HD²	https://googleplusimages.com/CANALBRASIL.png	https://example.com/stream.m3u8	Geral	Canalbrasil.br	768	2026-06-11 19:56:16.52403+00
bb4eefd6-ea05-43c2-b07a-7087bd5e7996	TCM HD¹	https://googleplusimages.com/TCM.png	https://example.com/stream.m3u8	Geral	Tcm.br	769	2026-06-11 19:56:16.52403+00
95545de2-e527-4406-a514-733064aeac91	TV TEM SOROCABA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	770	2026-06-11 19:56:16.52403+00
abb03638-5f17-4ebb-a6a6-964b8136081b	TV VANGUARDA S. J. DOS CAMPOS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	771	2026-06-11 19:56:16.52403+00
f0318918-b8b0-4232-bbe3-3368888d8523	TV VANGUARDA S. J. DOS CAMPOS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	772	2026-06-11 19:56:16.52403+00
579f4414-2dc5-4a89-ba9c-c7465659c8e8	TV TRIBUNA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtribunasp.br	773	2026-06-11 19:56:16.52403+00
89bbe9ca-cdd0-45db-9dff-354c6e38c3c1	TV TRIBUNA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtribunasp.br	774	2026-06-11 19:56:16.52403+00
dd6e2070-0689-4ead-90db-f0c01d5880b1	TV TRIBUNA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtribunasp.br	775	2026-06-11 19:56:16.52403+00
13d8543b-7db4-4a01-99b0-af23cc866eba	TV TEM BAURU FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	776	2026-06-11 19:56:16.52403+00
1e399905-cb1f-40ff-bfde-056f9d38f5e1	TV TEM BAURU HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	777	2026-06-11 19:56:16.52403+00
ea315e15-f819-44eb-9261-fda7175f4ede	INTERTV DOS VALES HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	778	2026-06-11 19:56:16.52403+00
809bb0a8-107c-4750-aede-40184f45e798	GLOBO NORDESTE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	779	2026-06-11 19:56:16.52403+00
923f30a6-b979-4990-84ea-dccd1879b0c6	TV ASA BRANCA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Asabranca.br	780	2026-06-11 19:56:16.52403+00
2fc7aa5a-3601-444b-89d3-7eec1fee1678	TV BAHIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	781	2026-06-11 19:56:16.52403+00
be9e38eb-71d8-40d3-93dc-50fdb89ed33b	INTERTV CABUGI FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	782	2026-06-11 19:56:16.52403+00
59bae464-c29b-4a64-8a38-9cdb5e438125	INTERTV CABUGI HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	783	2026-06-11 19:56:16.52403+00
6af0d2dc-c95f-4f49-a990-962e8e9e6a71	TV VERDES MARES CARIRI HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	784	2026-06-11 19:56:16.52403+00
59f204ac-7128-42fc-9546-45c71e0ae57a	RBS TV CAXIAS DO SUL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	785	2026-06-11 19:56:16.52403+00
cd2ef2c1-63c1-452b-8f30-b6eda94dd8d4	RBS TV PELOTAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	786	2026-06-11 19:56:16.52403+00
a8d4783b-057c-4c5f-bdf9-b08b794ec0fa	NSC TV JOINVILLE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	787	2026-06-11 19:56:16.52403+00
2569901e-222e-4fa2-9903-10efe2a63dba	RPC CURITIBA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	788	2026-06-11 19:56:16.52403+00
d6509425-e6f4-4b53-99f5-778ba82ae95f	RPC FOZ DO IGUAÇU HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	789	2026-06-11 19:56:16.52403+00
60f1daa2-d32c-436f-b62b-ce7ef0ad47f6	RPC FOZ DO IGUAÇU FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	790	2026-06-11 19:56:16.52403+00
eb3ef58a-a45e-4e61-b2e6-aeba80573a15	RPC FOZ DO IGUAÇU HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	791	2026-06-11 19:56:16.52403+00
999bf755-5c93-412c-9029-cfc96c7c5ae5	RPC CASCAVEL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	792	2026-06-11 19:56:16.52403+00
741ea520-2cd7-4957-a44d-c4cd028ae0bc	RPC PARANAVAÍ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	793	2026-06-11 19:56:16.52403+00
2c7b9541-d6c2-4203-85b3-0c559d9a97d3	RPC PARANAVAÍ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	794	2026-06-11 19:56:16.52403+00
ea4a5103-a9e7-43e3-be54-3737ce5d59a3	TV MORENA H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	795	2026-06-11 19:56:16.52403+00
b2f6c42e-4f42-43a8-9024-0b9863f1bf1a	TV MORENA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	796	2026-06-11 19:56:16.52403+00
2638ddc8-e5f8-40e6-bfa4-38c38eed11f2	TV LIBERAL BELÉM H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	797	2026-06-11 19:56:16.52403+00
b524bc16-4962-4055-800c-39d6e472131e	SBT RIO FHD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtrj.br	798	2026-06-11 19:56:16.52403+00
04a5e4ef-5e3e-4f61-8a69-7750fb568b5b	FILM&ARTS SD¹	https://googleplusimages.com/FILM&ARTS.png	https://example.com/stream.m3u8	Geral	Filmarts.br	799	2026-06-11 19:56:16.52403+00
b1cbe0c6-868a-4304-bb14-a9483782b090	FILM&ARTS HD²	https://googleplusimages.com/FILM&ARTS.png	https://example.com/stream.m3u8	Geral	Filmarts.br	800	2026-06-11 19:56:16.52403+00
18038e73-84aa-4c49-b840-5021d86de3f1	FILM&ARTS FHD¹	https://googleplusimages.com/FILM&ARTS.png	https://example.com/stream.m3u8	Geral	Filmarts.br	801	2026-06-11 19:56:16.634568+00
33c7cf17-c2df-44c5-ac6f-2fce3100f66b	RPC CASCAVEL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	802	2026-06-11 19:56:16.634568+00
327fa0e9-b075-4ea6-ab59-a8908ec37f50	CANCAO NOVA HD¹	https://googleplusimages.com/CANCAONOVA.png	https://example.com/stream.m3u8	Geral	Cancaonova.br	803	2026-06-11 19:56:16.634568+00
53d20df6-669c-4cbf-a59b-5c830ae7c859	CANCAO NOVA HD+	https://googleplusimages.com/CANCAONOVA.png	https://example.com/stream.m3u8	Geral	Cancaonova.br	804	2026-06-11 19:56:16.634568+00
19043526-6ff9-46df-a7c1-23b746961062	TV NOVO TEMPO HD¹	https://googleplusimages.com/TVNOVOTEMPO.png	https://example.com/stream.m3u8	Geral	Tvnovotempo.br	805	2026-06-11 19:56:16.634568+00
821780b5-ef08-414c-9a71-8e9d9ae00080	TV APARECIDA HD²	https://i.imgur.com/TAaiWqh.png	https://example.com/stream.m3u8	Abertos	Tvaparecida.br	806	2026-06-11 19:56:16.634568+00
6d4cd62e-b570-4cd9-b3c2-13469b3af7bc	AGROBRASIL HD+	https://googleplusimages.com/AGROBRASIL.png	https://example.com/stream.m3u8	Geral	Ausente.br	807	2026-06-11 19:56:16.634568+00
f9a93bc7-a726-4532-bc9d-186b1f6d3964	TRAVEL BOX BRAZIL FHD¹	https://googleplusimages.com/TRAVELBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Travelboxbr.br	808	2026-06-11 19:56:16.634568+00
65f55360-8391-454b-aa03-9b1937536626	TRAVEL BOX BRAZIL HD²	https://googleplusimages.com/TRAVELBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Travelboxbr.br	809	2026-06-11 19:56:16.634568+00
e1a4a0bd-4274-4598-be90-18ff4ba46675	DUMDUM HD¹	https://googleplusimages.com/DUMDUM.png	https://example.com/stream.m3u8	Geral	Dumdum.br	810	2026-06-11 19:56:16.634568+00
e618075f-df30-43b4-9404-6a32aa8395e1	DUMDUM FHD¹	https://googleplusimages.com/DUMDUM.png	https://example.com/stream.m3u8	Geral	Dumdum.br	811	2026-06-11 19:56:16.634568+00
a161ac18-5fdf-47ec-b84e-e55d69838e1f	DOGTV FHD²	https://googleplusimages.com/DOGTV.png	https://example.com/stream.m3u8	Geral	Dogtv.pt	812	2026-06-11 19:56:16.634568+00
87dcd2a9-3c14-4e80-8a5c-6816ba570fcc	DOGTV HD²	https://googleplusimages.com/DOGTV.png	https://example.com/stream.m3u8	Geral	Dogtv.pt	813	2026-06-11 19:56:16.634568+00
cbe7b01d-b9ff-45dd-9bbd-0c3ed7350871	FASHIONTV HD²	https://googleplusimages.com/FASHIONTV.png	https://example.com/stream.m3u8	Variedades/Música	Fashiontv.br	814	2026-06-11 19:56:16.634568+00
84356ac8-b5a0-46c8-bde2-8bd31e948bfb	FASHIONTV FHD²	https://googleplusimages.com/FASHIONTV.png	https://example.com/stream.m3u8	Variedades/Música	Fashiontv.br	815	2026-06-11 19:56:16.634568+00
b7d19465-df7b-4ce3-b5f0-fc4e8724fe8d	ARTE 1 HD²	https://googleplusimages.com/ARTE1.png	https://example.com/stream.m3u8	Documentários	Arte1.br	816	2026-06-11 19:56:16.634568+00
2578945b-ad2e-4b54-8769-418137024193	ADULT SWIM HD²	https://googleplusimages.com/ADULTSWIM.png	https://example.com/stream.m3u8	Geral	Adultswim.br	817	2026-06-11 19:56:16.634568+00
0f8fece5-8e0b-4ce5-905b-a59a3b4e3de8	SPORTV 4K¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	818	2026-06-11 19:56:16.634568+00
d67f587c-bd3c-4b66-ae94-f6c46fa4726a	CARTOONITO HD²	https://googleplusimages.com/CARTOONITO.png	https://example.com/stream.m3u8	Infantil	Cartoonito.br	819	2026-06-11 19:56:16.634568+00
e70174bc-93ef-4e5c-8f3b-56df6ad5f560	[LEG] AMC HD²	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	820	2026-06-11 19:56:16.634568+00
a32866ce-857b-4910-8def-c1e113afbbba	[LEG] HBO MUNDI HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	821	2026-06-11 19:56:16.634568+00
9ede9580-48df-433e-9561-99c0d0491065	[LEG] HBO SIGNATURE HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	822	2026-06-11 19:56:16.634568+00
48603b84-9bdc-408c-b87a-bbab5cd0f96c	[LEG] TNT HD²	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	823	2026-06-11 19:56:16.634568+00
585b10d2-40f9-4067-87eb-5b25057bd0c0	DISCOVERY KIDS FHD²	https://googleplusimages.com/DISCOVERYKIDS.png	https://example.com/stream.m3u8	Documentários	Discoverykids.br	824	2026-06-11 19:56:16.634568+00
29bb1259-f6cb-476e-88da-f10997b17a36	GLOOB FHD¹	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	825	2026-06-11 19:56:16.634568+00
82f8a25e-548d-4842-9399-b23c5f34d690	WOOHOO HD²	https://googleplusimages.com/WOOHOO.png	https://example.com/stream.m3u8	Geral	Woohoo.br	826	2026-06-11 19:56:16.634568+00
6c12c459-4904-41b2-b6bb-0b5ee9cde9eb	PREMIERE 8  - MOSAICO HD¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere8.br	827	2026-06-11 19:56:16.634568+00
67297069-d4e7-44a4-9c60-128e2a34ff35	DISCOVERY HOME & HEALTH FHD¹	https://googleplusimages.com/DISCOVERYHOME&HEALTH.png	https://example.com/stream.m3u8	Documentários	Discoveryhomehealth.br	828	2026-06-11 19:56:16.634568+00
ec3c1d84-e709-49fc-84f6-c02e706d3448	FOOD NETWORK FHD²	https://googleplusimages.com/FOODNETWORK.png	https://example.com/stream.m3u8	Geral	Foodnetwork.br	829	2026-06-11 19:56:16.634568+00
e4ab2d2d-3be8-4eef-a472-0680ffe3fd17	[LEG] SPACE HD²	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	830	2026-06-11 19:56:16.634568+00
70489000-0b3b-480b-9202-55295ee386d3	[LEG] MEGAPIX HD²	https://i.imgur.com/pRDsvMZ.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	831	2026-06-11 19:56:16.634568+00
f946b4c8-e51f-4c4b-92cd-45818f6bda80	[LEG] CINEMAX HD²	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	832	2026-06-11 19:56:16.634568+00
8925b7db-dee7-4c9f-a2ab-d1b172e20da7	[LEG] TELECINE CULT HD²	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	833	2026-06-11 19:56:16.634568+00
17115957-33cb-4f51-bdd4-9e7bb31660b3	BAND RN HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandrn.br	834	2026-06-11 19:56:16.634568+00
7fd3cfbb-7dc7-4881-be64-256b87daea97	24H OS HERCULÓIDES¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	835	2026-06-11 19:56:16.634568+00
274979a9-39c3-49cd-9678-66cc4c880e52	TV CULTURA HD¹	https://i.imgur.com/zbIF1bs.png	https://example.com/stream.m3u8	Abertos	Tvcultura.br	836	2026-06-11 19:56:16.634568+00
f64e0785-c31b-4a09-80c1-ec7f6ca3838b	FASHIONTV H265²	https://googleplusimages.com/FASHIONTV.png	https://example.com/stream.m3u8	Variedades/Música	Fashiontv.br	837	2026-06-11 19:56:16.634568+00
ee14bb80-c386-46fb-a071-a747992c4d15	TV FRONTEIRA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvfronteirasp.br	838	2026-06-11 19:56:16.634568+00
94413f9e-84bc-4431-901c-f41a2a9eadc2	TV TEM SOROCABA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	839	2026-06-11 19:56:16.634568+00
009cbad9-b4a9-49bb-a1f7-6a897ebb9324	TV GAZETA SUL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	840	2026-06-11 19:56:16.634568+00
b875b042-8100-4bba-85d1-006cb92e3f00	FISHTV FHD²	https://googleplusimages.com/FISHTV.png	https://example.com/stream.m3u8	Geral	Fishtv.br	841	2026-06-11 19:56:16.634568+00
ca843c4c-ace1-48f0-a8d8-9425aea698b2	MUSIC BOX BRAZIL FHD¹	https://googleplusimages.com/MUSICBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Musicboxbr.br	842	2026-06-11 19:56:16.634568+00
fac3dcc5-9cc8-4410-96c9-c72f7a28a3ea	MUSIC BOX BRAZIL SD¹	https://googleplusimages.com/MUSICBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Musicboxbr.br	843	2026-06-11 19:56:16.634568+00
44dba07e-16e3-4d99-a475-134dffba6dd0	DISNEY+ 1 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	844	2026-06-11 19:56:16.634568+00
3bc25111-9737-4c3f-8ea3-83d049b26d7a	DISNEY+ 5 HD¹	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	845	2026-06-11 19:56:16.634568+00
a787fca1-3630-4d29-ac07-695c9c87a0a9	TV INTEGRAÇÃO UBERABA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	846	2026-06-11 19:56:16.634568+00
8df696b2-1a41-4531-83e9-619f73b5b9e6	TV INTEGRAÇÃO UBERABA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	847	2026-06-11 19:56:16.634568+00
5d478620-4487-49c5-926e-20261104a739	RPC CASCAVEL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	848	2026-06-11 19:56:16.634568+00
e51352e2-0acd-41c0-973b-a6259ba03b5e	RPC LONDRINA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	849	2026-06-11 19:56:16.634568+00
8135d0f0-db80-4e66-9bf0-0f35b940191d	RBS TV PASSO FUNDO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	850	2026-06-11 19:56:16.634568+00
4a3eb359-eb18-4a3e-b54c-f68c27a8c651	RBS TV PASSO FUNDO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	851	2026-06-11 19:56:16.634568+00
96501c65-1339-4248-aeb1-26b7a361899d	TV SUBAÉ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	852	2026-06-11 19:56:16.634568+00
16318c75-0c5c-41a3-877e-96e2d1b32e08	JP NEWS FHD¹	https://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	853	2026-06-11 19:56:16.634568+00
2891b014-ab2d-4635-ac89-2f2f3d47de35	JP NEWS H265²	https://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	854	2026-06-11 19:56:16.634568+00
948301b2-aa9d-4eda-b2a0-aabf41e5fcc4	JP NEWS HD¹	https://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	855	2026-06-11 19:56:16.634568+00
1666020a-ac2d-426c-83c4-fdb5e76ac7e3	DISNEY+ 1 HD¹	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	856	2026-06-11 19:56:16.634568+00
f52c226e-3b0a-455e-8b80-7299f124ea4c	DISNEY+ 2 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	857	2026-06-11 19:56:16.634568+00
298f63c2-fd61-40f7-99f8-09541fa73bce	DISNEY+ 4 HD¹	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	858	2026-06-11 19:56:16.634568+00
34b71132-74b1-4e9a-941b-0cec140c9c52	NBA LEAGUE PASS 1 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	859	2026-06-11 19:56:16.634568+00
6f1a8ad7-eb6e-4907-858b-a98a81b0d96f	NBA LEAGUE PASS 2 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	860	2026-06-11 19:56:16.634568+00
fe1ee2da-b9b9-44b9-be38-103dc761bb1d	NBA LEAGUE PASS 3 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	861	2026-06-11 19:56:16.634568+00
ffd5c362-0e9b-4de6-9e80-92bf59560f2e	NBA LEAGUE PASS 8 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	862	2026-06-11 19:56:16.634568+00
62d11597-2c16-412e-a844-190d59bfbb51	INTERTV GRANDE MINAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	863	2026-06-11 19:56:16.634568+00
afbfa5ea-01b4-4b5c-a763-6ddad692ae9e	TV ASA BRANCA AL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoal.br	864	2026-06-11 19:56:16.634568+00
7886e3ca-36a3-4d23-92bb-bd0574b9bba1	TV INTEGRAÇÃO JUIZ DE FORA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	865	2026-06-11 19:56:16.634568+00
76e4736c-d736-4246-ab9c-57aa0d30ed84	TV DIÁRIO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvdiariosp.br	866	2026-06-11 19:56:16.634568+00
79e66eca-9beb-4149-bbaa-153f42945753	NBA LEAGUE PASS 6 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	867	2026-06-11 19:56:16.634568+00
7c072e38-8b87-4409-8599-cf05b45965c9	NBA LEAGUE PASS 7 HD¹	https://googleplusimages.com/NBALEAGUEPASS.png	https://example.com/stream.m3u8	Geral	Nbaleaguepass.br	868	2026-06-11 19:56:16.634568+00
be17906a-1552-41be-9bcd-ddfc6fac31be	RECORD EUROPA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	tvrecord.pt	869	2026-06-11 19:56:16.634568+00
5c144f10-451c-4605-ad9a-e635e3ae485c	TRACE BRASIL HD¹	https://googleplusimages.com/TRACEBRASIL.png	https://example.com/stream.m3u8	Geral	Tracebr.br	870	2026-06-11 19:56:16.634568+00
5f5873ed-2a00-43be-b68e-88cc2d7b8073	AGROMAIS FHD¹	https://googleplusimages.com/AGROMAIS.png	https://example.com/stream.m3u8	Geral	Agromais.br	871	2026-06-11 19:56:16.634568+00
efb7ca34-e3fb-4b6d-baf9-e08c5d12745e	NSC TV CRICIÚMA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	872	2026-06-11 19:56:16.634568+00
0a974429-29bc-4dc0-b84e-bf6d5b0d32c7	RBS TV SANTA MARIA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	873	2026-06-11 19:56:16.634568+00
87abf09d-c3c7-4886-9d5d-0e3bd7149304	RBS TV SANTA MARIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	874	2026-06-11 19:56:16.634568+00
2b436cc4-81f1-42d7-a063-a77e426ddce3	HISTORY H265¹	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	875	2026-06-11 19:56:16.634568+00
ca33f962-f5ca-44c1-af26-c9b2247a98c3	REDE GOSPEL HD²	https://i.imgur.com/yqKqs8Q.png	https://example.com/stream.m3u8	Geral	Redegospel.br	876	2026-06-11 19:56:16.634568+00
7277909c-5bf8-4807-a22b-2d0f592afc3c	NFL GAME PASS 1 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	877	2026-06-11 19:56:16.634568+00
33597821-292d-4cc9-93b2-d6fb2adf5fca	NFL GAME PASS 2 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	878	2026-06-11 19:56:16.634568+00
69029354-469d-4752-9567-bed9e7c2809b	NFL GAME PASS 3 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	879	2026-06-11 19:56:16.634568+00
390733d1-5803-48c6-8027-fa263bec8886	NFL GAME PASS 4 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	880	2026-06-11 19:56:16.634568+00
c48bbbcd-245b-45c7-9f33-643be3721a86	NFL GAME PASS 5 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	881	2026-06-11 19:56:16.634568+00
c3c69970-e0f1-46c3-8905-6f6252a43df7	NFL GAME PASS 6 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	882	2026-06-11 19:56:16.634568+00
6aca55b3-3c64-4c80-b214-9765db0bc968	NFL GAME PASS 7 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	883	2026-06-11 19:56:16.634568+00
41514e52-186c-480c-a729-8f0b782af18d	NFL GAME PASS 8 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	884	2026-06-11 19:56:16.634568+00
4ef26ce6-3195-484f-a39e-d1c594ddec4d	NFL GAME PASS 9 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	885	2026-06-11 19:56:16.634568+00
34f66613-a242-4b50-9c96-3c1ea879dcb0	NFL GAME PASS 10 HD	https://googleplusimages.com/NFLGAMEPASS.png	https://example.com/stream.m3u8	Geral	Nflgamepass.br	886	2026-06-11 19:56:16.634568+00
db7b2b77-4216-4e68-a64b-1776e5a05a54	CNT HD¹	https://i.imgur.com/npNSQuo.png	https://example.com/stream.m3u8	Geral	Cnt.br	887	2026-06-11 19:56:16.634568+00
fcbff191-3eb2-48e2-8e1b-d5ededc37984	AGENDA FUTEBOL	https://googleplusimages.com/FUTEBOL.png	https://example.com/stream.m3u8	Geral	Agendafut.info	888	2026-06-11 19:56:16.634568+00
5e663b7a-459b-458e-a156-26d8b5971a22	TVE BAHIA HD¹	https://googleplusimages.com/TVEBAHIA.png	https://example.com/stream.m3u8	Geral	Tvbrasilba.br	889	2026-06-11 19:56:16.634568+00
6aaff1bc-d3a3-459c-8477-2ab27448ac80	AGENDA F1	https://googleplusimages.com/FORMULA1.png	https://example.com/stream.m3u8	Geral	Agendaf1.info	890	2026-06-11 19:56:16.634568+00
fa9a7e91-870e-4c91-b95f-dedf32a1a172	ESPN FHDR²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	891	2026-06-11 19:56:16.634568+00
c9fd1e4b-ca56-430e-9119-0640032e6d77	TELECINE PIPOCA FHDR²	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	892	2026-06-11 19:56:16.634568+00
a82ac913-6957-48b3-b7de-eadcf9377cd5	SPORTV FHDR²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	893	2026-06-11 19:56:16.634568+00
2f3ed1d7-9233-4843-b1f0-4f71db5f8edb	CNN BRASIL FHDR²	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	894	2026-06-11 19:56:16.634568+00
36eae4b3-2ae6-4135-9813-9de1a47512ef	GLOBONEWS FHDR²	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	895	2026-06-11 19:56:16.634568+00
86cfa5ee-6131-40ff-9b93-cdfc6c4c407a	BAND SP FHDR¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	896	2026-06-11 19:56:16.634568+00
99ebcd55-f2f1-40e0-8f10-8be9a6b7b5f1	GLOBO SP FHDR¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	897	2026-06-11 19:56:16.634568+00
8f9ca3e8-43cc-4230-b7df-7b305e9a06ac	CNT HD²	https://i.imgur.com/npNSQuo.png	https://example.com/stream.m3u8	Geral	Cnt.br	898	2026-06-11 19:56:16.634568+00
643b570e-9977-4770-ab77-ada653718819	[LEG] WARNER CHANNEL HD²	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	899	2026-06-11 19:56:16.634568+00
c06fc22f-cf71-4bb0-a6a2-b84f0153d042	PRIME VIDEO 1 HD²	https://googleplusimages.com/PRIMEVIDEO.png	https://example.com/stream.m3u8	Geral	Primevideo.br	900	2026-06-11 19:56:16.634568+00
1bb1deaf-1018-4162-b032-932e59bffa52	REDETV! RS HD	https://googleplusimages.com/REDETV.png	https://example.com/stream.m3u8	Abertos	Redetvsp.br	1001	2026-06-11 19:56:16.729716+00
d1312104-b637-40be-ae2e-d868032494a4	PREMIERE CLUBES H265 (60)¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	901	2026-06-11 19:56:16.634568+00
08c86ea4-03a1-4643-9da3-03b53c8a454d	REDE CULTURA DO PARÁ HD¹	https://i.imgur.com/dQNPTTv.png	https://example.com/stream.m3u8	Abertos	Tvcultura.br	902	2026-06-11 19:56:16.634568+00
0b264172-f978-4e4e-b25d-843b78d5624d	TV A CRITICA FHD²	https://googleplusimages.com/TVACRITICA.png	https://example.com/stream.m3u8	Geral	Tvacritica.br	903	2026-06-11 19:56:16.634568+00
ffaf580e-7041-49ed-bd8b-c481875c38c9	TV BRASIL CENTRAL HD+	https://googleplusimages.com/TVCULTURA.png	https://example.com/stream.m3u8	Geral	Tvbrasilcentral.br	904	2026-06-11 19:56:16.634568+00
0c43eadb-0974-4f3b-9378-a03383d72925	24H CARANGOS E MOTOCAS¹	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	905	2026-06-11 19:56:16.634568+00
a9e928f3-1a95-4d13-9a8e-c959c9acff66	TV CIDADE VERDE HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpi.br	906	2026-06-11 19:56:16.634568+00
e7ef638f-e763-4fe8-8fd4-be6e298f93ae	TV DIFUSORA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtsp.br	907	2026-06-11 19:56:16.634568+00
b4a4a238-7ac0-4491-9005-2d04b5dff039	MLB EXTRA INNINGS 1 HD	https://googleplusimages.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	908	2026-06-11 19:56:16.634568+00
a65abb3f-0c6a-476f-8841-c1aa97d6d09a	MLB EXTRA INNINGS 2 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	909	2026-06-11 19:56:16.634568+00
93fa1728-3de3-4534-aa50-059e4f8bae1b	MLB EXTRA INNINGS 3 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	910	2026-06-11 19:56:16.634568+00
359671ae-d4ca-443d-bc21-0e766a948b02	MLB EXTRA INNINGS 4 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	911	2026-06-11 19:56:16.634568+00
c0356496-de53-4818-9e30-16ecbed8ee41	MLB EXTRA INNINGS 5 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	912	2026-06-11 19:56:16.634568+00
465d1715-1026-4c1c-ab64-8a357e917108	MLB EXTRA INNINGS 6 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	913	2026-06-11 19:56:16.634568+00
b6c8d821-ee72-4ab4-8288-9fbdba5f8b02	MLB EXTRA INNINGS 7 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	914	2026-06-11 19:56:16.634568+00
78979098-e855-4177-9625-63c7365df070	MLB EXTRA INNINGS 8 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	915	2026-06-11 19:56:16.634568+00
8142dd40-bb74-4ea7-be8d-f2ee42b85bae	MLB EXTRA INNINGS 9 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	916	2026-06-11 19:56:16.634568+00
8ec6b09f-25da-4c86-8d8e-66110de235f1	MLB EXTRA INNINGS 10 HD	https://i.imgur.com/y6gXEhn.png	https://example.com/stream.m3u8	Geral	Mlbextrainnings.br	917	2026-06-11 19:56:16.634568+00
be2ee7eb-acfb-4e85-bc9f-d9a4867b1710	SIC TV HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordro.br	918	2026-06-11 19:56:16.634568+00
d1847948-6d21-4dc2-bd30-9afc1e3e2c24	RIT HD²	https://i.imgur.com/LJDsM13.png	https://example.com/stream.m3u8	Geral	Rit.br	919	2026-06-11 19:56:16.634568+00
5f115978-fc74-4241-8199-5385eeb90f66	SESCTV FHD+	https://googleplusimages.com/SESCTV.png	https://example.com/stream.m3u8	Geral	Sesctv.br	920	2026-06-11 19:56:16.634568+00
fa1c15ce-a3c4-4994-9d32-c5e8ed7c96d7	RED BULL TV FHD+	https://googleplusimages.com/REDBULLTV.png	https://example.com/stream.m3u8	Geral	479911	921	2026-06-11 19:56:16.634568+00
294a861f-007a-4951-8ac9-555eaabfcfbe	24H BATFINO	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Desenhos.br	922	2026-06-11 19:56:16.634568+00
aecc4965-cbea-4193-996a-f9841e05bbc7	(+18) PLAYBOY TV FHD²	https://googleplusimages.com/PLAYBOYTV.png	https://example.com/stream.m3u8	Adulto	Playboytv.br	923	2026-06-11 19:56:16.634568+00
71b1a56f-c9de-426c-b3e1-a871e740d10e	MUSIC BOX BRAZIL HD¹	https://googleplusimages.com/MUSICBOXBRAZIL.png	https://example.com/stream.m3u8	Geral	Musicboxbr.br	924	2026-06-11 19:56:16.634568+00
5cb8266c-c89f-4e4a-9c19-ebefe0e43ded	ADULT SWIM FHD²	https://googleplusimages.com/ADULTSWIM.png	https://example.com/stream.m3u8	Geral	Adultswim.br	925	2026-06-11 19:56:16.634568+00
d1b61b6b-f5a1-48ec-9656-c16db59b6e82	JP NEWS HD²	https://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	926	2026-06-11 19:56:16.634568+00
c708259e-4d68-479c-a34a-fe4aa5ed7631	PREMIERE 8  - MOSAICO HD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere8.br	927	2026-06-11 19:56:16.634568+00
496b961c-3fb1-44ce-84e3-770f33d08392	DUMDUM HD²	https://googleplusimages.com/DUMDUM.png	https://example.com/stream.m3u8	Geral	Dumdum.br	928	2026-06-11 19:56:16.634568+00
524b315c-4c21-4c6f-a459-492bc7dded78	TV VERDES MARES FHDR¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	929	2026-06-11 19:56:16.634568+00
6e9b4943-31cc-4fba-b2ed-8e0b849c7cd0	RECORD RIO FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrj.br	930	2026-06-11 19:56:16.634568+00
3bcb92e0-2be2-4891-bc02-18f8662e4995	GLOOBINHO H265¹	https://googleplusimages.com/GLOOBINHO.png	https://example.com/stream.m3u8	Infantil	Gloobinho.br	931	2026-06-11 19:56:16.634568+00
b0c56319-a510-4744-8feb-adc245db7536	RECORD MINAS HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordmg.br	932	2026-06-11 19:56:16.634568+00
aa2d7d8f-8523-4c9a-be2a-5d27d584eedc	RECORD BRASÍLIA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recorddf.br	933	2026-06-11 19:56:16.634568+00
3c6ed9d0-cdd1-4682-9ff8-a57d524e0ce2	RECORD BAHIA FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordba.br	934	2026-06-11 19:56:16.634568+00
79b06e4a-38ed-4f53-8f5c-fef1441f7fd6	RECORD BAHIA SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordba.br	935	2026-06-11 19:56:16.634568+00
834483a7-6825-4457-84ba-87203b49af8f	GLOBO RIO H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	936	2026-06-11 19:56:16.634568+00
90a6014c-1313-4629-b46d-d7eaa69c7b99	GLOBO NORDESTE H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	937	2026-06-11 19:56:16.634568+00
25196b1a-16ac-4077-b6b4-1aa145062651	RBS TV PORTO ALEGRE H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	938	2026-06-11 19:56:16.634568+00
ebdf423b-6918-44f8-a9dd-102864dac07c	SBT SP H265¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	939	2026-06-11 19:56:16.634568+00
163261b0-5108-4e5f-9031-150647d6ec4d	RECORD BELÉM HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordpa.br	940	2026-06-11 19:56:16.634568+00
78c306b0-fd88-49b8-a689-38ad054b601e	EPTV CENTRAL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	941	2026-06-11 19:56:16.634568+00
0e40d9f6-fccf-41b8-bd1f-db51a7edd6e6	TV TEM BAURU HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	942	2026-06-11 19:56:16.634568+00
b46a9e57-aba7-4438-9922-eab3ae8e90ef	TV TEM S. J. DO RIO PRETO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	943	2026-06-11 19:56:16.634568+00
94013c4e-cba6-43fe-91b3-ffff338c0ee2	TV TEM S. J. DO RIO PRETO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	944	2026-06-11 19:56:16.634568+00
e50d3314-a32e-4d82-b758-2177641d2d33	TV VANGUARDA TAUBATÉ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	945	2026-06-11 19:56:16.634568+00
7db7ca97-ff96-4483-9c37-98e87964c32b	TV VANGUARDA TAUBATÉ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	946	2026-06-11 19:56:16.634568+00
82655111-849f-4a9a-8f39-6ccdd435dfe0	TV INTEGRAÇÃO JUIZ DE FORA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	947	2026-06-11 19:56:16.634568+00
0be026c0-a231-4412-8489-453d390baf23	TV INTEGRAÇÃO JUIZ DE FORA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	948	2026-06-11 19:56:16.634568+00
1aa46c1c-42ef-4348-bed0-9c60a99874db	TV BAHIA H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	949	2026-06-11 19:56:16.634568+00
11344bcf-e819-49ba-94c6-2eb0a927617b	TV SANTA CRUZ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	950	2026-06-11 19:56:16.634568+00
c7fa4245-b929-439e-8db0-7064f6ef79d3	INTERTV CABUGI HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	951	2026-06-11 19:56:16.634568+00
9498b238-e806-4f0a-adeb-deab644a3a54	TV ASA BRANCA AL SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoal.br	952	2026-06-11 19:56:16.634568+00
09a433dd-b7bf-4caf-a1d6-e8bcdc26bbdd	TV MIRANTE SÃO LUÍS H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	953	2026-06-11 19:56:16.634568+00
f48b1ac5-70a6-498a-895f-2d3d6b85364f	TV INTEGRAÇÃO ARAXÁ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	954	2026-06-11 19:56:16.634568+00
1df7d22d-abd0-44f0-8379-ec7e59185dec	TV INTEGRAÇÃO ARAXÁ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	955	2026-06-11 19:56:16.634568+00
d4bbf429-c546-46bf-8088-8c421ceabd5c	TV VERDES MARES CARIRI HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	956	2026-06-11 19:56:16.634568+00
b4e5b753-2fe8-431f-aa6f-fc70bf41f41c	TV VERDES MARES H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	957	2026-06-11 19:56:16.634568+00
8f4ba189-0032-4636-a606-c1ed0214c674	RBS TV DOS VALES FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	958	2026-06-11 19:56:16.634568+00
00a51a39-c245-4d8e-ab4b-8f942a3c220d	RBS TV DOS VALES HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	959	2026-06-11 19:56:16.634568+00
5d20b8fc-d38c-4fd1-a895-28abb8252b9e	RBS TV PASSO FUNDO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	960	2026-06-11 19:56:16.634568+00
f2b34713-499b-4aa0-a336-f9f76f00dfa7	RBS TV SANTA MARIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	961	2026-06-11 19:56:16.634568+00
a1349a64-185f-4927-a008-4a7e81c4ddf7	NDTV FLORIANÓPOLIS HD+	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordsc.br	962	2026-06-11 19:56:16.634568+00
2ac3eb6b-a17f-4f0e-bc35-8dbca4945fa4	TV GUARARAPES HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpe.br	963	2026-06-11 19:56:16.634568+00
246ae13b-a228-4306-85ef-e146a6f1470a	TV CORREIO FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpb.br	964	2026-06-11 19:56:16.634568+00
bd503244-991d-4f50-9728-d39b5a9d5a6b	TV CIDADE FORTALEZA FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordce.br	965	2026-06-11 19:56:16.634568+00
5b3fd7e3-9745-490f-a1f4-56186adbee65	LIKE FHD¹	https://googleplusimages.com/LIKE.png	https://example.com/stream.m3u8	Geral	Like.br	966	2026-06-11 19:56:16.634568+00
bcfd01c5-41e8-4b86-ba9b-29acee37dfe6	LIKE HD¹	https://googleplusimages.com/LIKE.png	https://example.com/stream.m3u8	Geral	Like.br	967	2026-06-11 19:56:16.634568+00
5d48118f-129e-4225-ab1f-a60ba5be4c65	BOX KIDS TV HD+	https://googleplusimages.com/BOXKIDS.png	https://example.com/stream.m3u8	Geral	Boxkids.br	968	2026-06-11 19:56:16.634568+00
3e3323d2-5864-40fe-89e7-0af8cf5ce04e	SCC SBT HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsc.br	969	2026-06-11 19:56:16.634568+00
53ba7c3f-b04d-45bd-bf98-f8753e1dd626	TH+ SBT INTERIOR HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Thsbtintsp.br	970	2026-06-11 19:56:16.634568+00
4f39103d-67ed-49c7-a245-3c438e92dc5a	TV NORTE PARÁ HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpa.br	971	2026-06-11 19:56:16.634568+00
5e6231d6-4b5a-4cee-a418-643e86405409	BEMTV HD	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Variedades/Música	Sbtmt.br	972	2026-06-11 19:56:16.634568+00
652916f4-4b5e-4a15-af39-83c07bcb8e27	NSC TV FLORIANÓPOLIS H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	973	2026-06-11 19:56:16.634568+00
d10e1088-c8d5-4fea-8086-0182bd2a5c75	NSC TV CHAPECÓ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	974	2026-06-11 19:56:16.634568+00
0bb8a386-00a4-4bf6-9cd5-c56c1348727e	RPC CURITIBA H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	975	2026-06-11 19:56:16.634568+00
652857db-24e7-4f43-a865-e18738bf57ba	RPC FOZ DO IGUAÇU H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	976	2026-06-11 19:56:16.634568+00
c47d1a8d-7b16-435d-b6ed-eccf0e4de866	RPC MARINGÁ H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	977	2026-06-11 19:56:16.634568+00
5d3ee393-6f1e-4b6d-b963-1244030cf9f7	TV CULTURA HD²	https://i.imgur.com/zbIF1bs.png	https://example.com/stream.m3u8	Abertos	Tvcultura.br	978	2026-06-11 19:56:16.634568+00
a7e8ab7a-228d-4cb1-a521-d5e771a7aea9	TV GAZETA VITÓRIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	979	2026-06-11 19:56:16.634568+00
1225dad1-6a5f-4724-b308-d7592a72e712	TV GAZETA SUL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	980	2026-06-11 19:56:16.634568+00
2fa9f9ef-9990-4aae-9afb-bb576aa6fc88	TV GAZETA SUL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	981	2026-06-11 19:56:16.634568+00
7f0e7a27-f133-4469-8167-098dce8259d7	TV CENTRO AMÉRICA H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	982	2026-06-11 19:56:16.634568+00
f6f695b8-46f2-46af-844a-23907e6d2bac	TV CENTRO AMÉRICA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	983	2026-06-11 19:56:16.634568+00
e2910c6b-7316-4d00-89e8-5b5248b866df	TV MORENA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	984	2026-06-11 19:56:16.634568+00
e0eae93d-8b32-45c0-b654-d647e340a78b	TV LIBERAL BELÉM HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	985	2026-06-11 19:56:16.634568+00
04982c66-92fa-47c9-81be-b78967327861	REDE AMAZÔNICA PORTO VELHO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globorr.br	986	2026-06-11 19:56:16.634568+00
0436faaf-d7f6-4f21-8252-c4d6233e8156	TV TRIBUNA PE HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandpe.br	987	2026-06-11 19:56:16.634568+00
c0acbe64-5f66-4f32-9b81-2fece16ff410	BAND CEARÁ HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandce.br	988	2026-06-11 19:56:16.634568+00
e1def394-e5ac-4613-ad63-093c91d0046a	RBA TV HD	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandpa.br	989	2026-06-11 19:56:16.634568+00
fac09de4-bcfd-45e0-ac73-bbe1c5ff8f83	SABOR & ARTE FHD¹	https://googleplusimages.com/SABOR&ARTE.png	https://example.com/stream.m3u8	Geral	Saborearte.br	990	2026-06-11 19:56:16.634568+00
ffa39902-59ea-4638-b9e3-036c58d458f5	TERRA VIVA HD²	https://googleplusimages.com/TERRAVIVA.png	https://example.com/stream.m3u8	Variedades/Música	Terraviva.br	991	2026-06-11 19:56:16.634568+00
b3cacf5d-6501-4e9f-b01e-a4a231d8c982	TH+ TV HD+	https://googleplusimages.com/THPLUS.png	https://example.com/stream.m3u8	Geral	Thtv.br	992	2026-06-11 19:56:16.634568+00
90994205-e4c0-41cf-a026-d10ce89442c4	[CA] FIGHT NETWORK HD	https://i.ibb.co/p02J0f7/FIGHTNETWORK.png	https://example.com/stream.m3u8	Geral	FightNetwork.pt	993	2026-06-11 19:56:16.634568+00
f19b9250-e3e2-4287-b91e-6dd86358365b	FISHTV H265²	https://googleplusimages.com/FISHTV.png	https://example.com/stream.m3u8	Geral	Fishtv.br	994	2026-06-11 19:56:16.634568+00
0bbe9c69-5daf-4a1f-82d9-4e53b5ef1013	FISHTV HD²	https://googleplusimages.com/FISHTV.png	https://example.com/stream.m3u8	Geral	Fishtv.br	995	2026-06-11 19:56:16.634568+00
aa43ee79-1597-494a-a738-2ef2003211f3	CNN INTERNATIONAL HD¹	https://googleplusimages.com/CNNINTERNATIONAL.png	https://example.com/stream.m3u8	Notícias	Cnnint.br	996	2026-06-11 19:56:16.634568+00
de908959-c2c1-48b1-b748-1bb09cc2833b	GLOBO NACIONAL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globo.br	997	2026-06-11 19:56:16.634568+00
429e0eb7-9ac0-458b-be25-6e34bab1204d	COPA VERDE 1 HD²	https://i.imgur.com/1LbJS3D.png	https://example.com/stream.m3u8	Geral	Vazio.br	998	2026-06-11 19:56:16.634568+00
214a4bab-53a7-4e42-9973-c9168476b1d0	COMBATE FHDR²	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	999	2026-06-11 19:56:16.634568+00
623e1287-62aa-418d-a4c7-32853be29427	BAND BAHIA SD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandba.br	1000	2026-06-11 19:56:16.634568+00
36a3691f-c253-4b1e-9f18-2a2a0a0ca9ba	COPA VERDE 2 HD²	https://i.imgur.com/1LbJS3D.png	https://example.com/stream.m3u8	Geral	Vazio.br	1002	2026-06-11 19:56:16.729716+00
5a84a7ae-146b-4fe8-b185-d345fc5c22fb	(+18) SEXPRIVÉ HD¹	https://googleplusimages.com/SEXPRIVE.png	https://example.com/stream.m3u8	Adulto	Sexprive.br	1003	2026-06-11 19:56:16.729716+00
5b8b5715-401b-421a-afec-6b8cf14ad938	TH+ RECORD CAMPINAS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Threcordcampinas.br	1004	2026-06-11 19:56:16.729716+00
e061482d-1689-45ad-9ac8-323a3545baba	RECORD MANAUS HD+	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordgo.br	1005	2026-06-11 19:56:16.729716+00
6f31ab6d-91c3-4995-b062-ffece3cd8108	SBT RIO HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtrj.br	1006	2026-06-11 19:56:16.729716+00
d3926563-29f0-46e4-871e-b7855d961c7b	SBT BRASILIA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtdf.br	1007	2026-06-11 19:56:16.729716+00
138d46b2-93b0-4c44-a4bd-ce922f34c8b0	SBT RS HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtrs.br	1008	2026-06-11 19:56:16.729716+00
486be331-6c0d-47de-b9be-7d865cb5f558	TV ARATU HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtba.br	1009	2026-06-11 19:56:16.729716+00
e717fc27-e6b1-45c5-a4a7-55eafc7fc556	TV ANHANGUERA PALMAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoto.br	1010	2026-06-11 19:56:16.729716+00
7a9d1261-204c-43fa-b15e-c65b225ae804	REDE BRASIL HD+	https://googleplusimages.com/RBTV.png	https://example.com/stream.m3u8	Geral	Redebrasil.br	1011	2026-06-11 19:56:16.729716+00
5c5cf2d9-daf4-48e6-99de-8f92ec04ca19	GLOBOPLAY NOVELAS FHD¹	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	1012	2026-06-11 19:56:16.729716+00
7d246e30-72c6-40cc-b6b9-d32622bf7fff	GLOBOPLAY NOVELAS H265¹	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	1013	2026-06-11 19:56:16.729716+00
d88b94d2-a654-49d9-a50c-f5d9485523f5	RBS TV PORTO ALEGRE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1014	2026-06-11 19:56:16.729716+00
ab1784ac-3a4f-4c6c-98b1-5d5759caa786	GLOBO MINAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globomg.br	1015	2026-06-11 19:56:16.729716+00
317a7217-d98b-49bf-a6b2-768a3b6a5ee5	INTERTV PLANÍCIE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1016	2026-06-11 19:56:16.729716+00
01c91914-42c2-43d5-a0d0-962de18e5956	EPTV CENTRAL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1017	2026-06-11 19:56:16.729716+00
afdc6389-e9a4-4ebf-aa7f-e2e4d8722077	TV VANGUARDA S. J. DOS CAMPOS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	1018	2026-06-11 19:56:16.729716+00
13b01f21-de81-4d43-8102-d0e14ff90797	TV INTEGRAÇÃO ARAXÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1019	2026-06-11 19:56:16.729716+00
9f0e6914-a977-4d8c-aa85-71b418dfdfdc	TV GAZETA VITÓRIA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1020	2026-06-11 19:56:16.729716+00
41384d38-ee97-41ef-90c3-ba6d3a452b1c	TV GAZETA VITÓRIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1021	2026-06-11 19:56:16.729716+00
68aa69b7-2f31-4d29-b50a-90d0e0ee8c05	TV CLUBE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	1022	2026-06-11 19:56:16.729716+00
d6cfc0ea-1943-4e6f-af38-5daeb5e04cb8	TV MIRANTE COCAIS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1023	2026-06-11 19:56:16.729716+00
8a784005-6e72-4e5e-9be4-f43060604f13	RECORD RIO PRETO HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordriopreto.br	1024	2026-06-11 19:56:16.729716+00
993d2c06-ee85-4f36-80a3-30c5d0ee5429	TV PARANAÍBA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordparanaiba.br	1025	2026-06-11 19:56:16.729716+00
ee6f9cdb-64c1-431e-bb29-3a29764e9c84	RICTV MARINGÁ HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Ricmaringa.br	1026	2026-06-11 19:56:16.729716+00
cc45f4c6-1357-41a0-a35f-1ecd16966080	TV TROPICAL FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordrn.br	1027	2026-06-11 19:56:16.729716+00
f8d57e4a-c794-418e-beed-1582b531bed9	TV TROPICAL HD°	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordrn.br	1028	2026-06-11 19:56:16.729716+00
f3e379cf-2ac9-4974-83da-302e402922ce	TV CIDADE FORTALEZA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordce.br	1029	2026-06-11 19:56:16.729716+00
cebcf9c9-25f5-4b83-966e-ef74bb698b25	TV ANTENA 10 HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpi.br	1030	2026-06-11 19:56:16.729716+00
85cb1c35-a9ca-4eb0-8858-2385eb434d25	GEEKDOT HD+	https://googleplusimages.com/geekdot.png	https://example.com/stream.m3u8	Geral	Geekdot.br	1031	2026-06-11 19:56:16.729716+00
d7bd4c68-2354-4a8b-8d7c-7318767525d6	OTAKU SIGN TV HD+	https://googleplusimages.com/otakusigntv.png	https://example.com/stream.m3u8	Geral	Ausente.br	1032	2026-06-11 19:56:16.729716+00
fc7ed056-0077-4bf7-88d7-deb6bf3ec0d1	ANIME TV HD°	https://googleplusimages.com/animetv.png	https://example.com/stream.m3u8	Geral	Ausente.br	1033	2026-06-11 19:56:16.729716+00
faca8326-af5a-4b45-91f2-d4e5ce85058d	WORDING TV HD°	https://googleplusimages.com/wordingtv.png	https://example.com/stream.m3u8	Geral	Ausente.br	1034	2026-06-11 19:56:16.729716+00
7ade03e1-6433-43b8-8f68-2fd6d0b6dabb	SBT NACIONAL HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	1035	2026-06-11 19:56:16.729716+00
0ae8a597-f56c-4b09-9d3f-b763d34037fc	SBT CUIABÁ HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtmt.br	1036	2026-06-11 19:56:16.729716+00
6848697f-8f58-4710-85b9-eb47e35dcea0	REDE MASSA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpr.br	1037	2026-06-11 19:56:16.729716+00
f91d30b5-585e-43a9-8259-1887fae9bbc0	TV CIDADE VERDE HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtpi.br	1038	2026-06-11 19:56:16.729716+00
ddd2782e-07c0-4d23-b3fa-69dc819f7216	TV PONTA NEGRA HD¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtrn.br	1039	2026-06-11 19:56:16.729716+00
9cef02f1-1d0c-407f-97b5-e9dcff75ddea	TV DIÁRIO CE HD¹	https://googleplusimages.com/TVDIARIO.png	https://example.com/stream.m3u8	Geral	Tvdiarioce.br	1040	2026-06-11 19:56:16.729716+00
93e3773b-f735-4d5d-964a-a2ef8e7f36be	AGENDA NBA	https://googleplusimages.com/NBA.png	https://example.com/stream.m3u8	Geral	Agendanba.info	1041	2026-06-11 19:56:16.729716+00
0ba1e61d-e84d-42dc-8aa7-f0037ddeed42	AGENDA UFC	https://googleplusimages.com/UFC.png	https://example.com/stream.m3u8	Geral	Agendaufc.info	1042	2026-06-11 19:56:16.729716+00
20474d13-dfaa-41b2-be6a-2b10d854e351	BAND RIO HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandrj.br	1043	2026-06-11 19:56:16.729716+00
be95b551-c4fc-47b0-99f8-77e386609358	BAND RS HD²	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandrs.br	1044	2026-06-11 19:56:16.729716+00
566542ff-bcc6-4e5c-9a69-c2aa3f8b4cba	DISNEY+ 3 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	1045	2026-06-11 19:56:16.729716+00
d38a9839-d0f3-4f2c-8976-16078863968f	PREMIERE CLUBES 4K	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	1046	2026-06-11 19:56:16.729716+00
d9edefcb-ede8-4cc1-8dcf-4ef7c1942f54	PREMIERE 2 FHDR¹	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	1047	2026-06-11 19:56:16.729716+00
3bbe30a1-3987-45f9-b80f-a506eb7211ee	GLOBO RIO FHDR¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	1048	2026-06-11 19:56:16.729716+00
3b67c273-0045-4481-a3a5-9d1152cadc33	SPORTV 2 FHDR¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	1049	2026-06-11 19:56:16.729716+00
9ca4e6ab-3754-477b-849e-78ba568affde	SPORTV 3 FHDR¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	1050	2026-06-11 19:56:16.729716+00
561c4d0f-6ba8-4adb-affb-91235baa327d	REDE SUPER HD+	https://googleplusimages.com/REDESUPER.png	https://example.com/stream.m3u8	Geral	Redesuper.br	1051	2026-06-11 19:56:16.729716+00
fac873f5-4b32-47a3-8ea0-7d8b6905880e	TV PARANA TURISMO HD³	https://i.imgur.com/uYG5Qql.png	https://example.com/stream.m3u8	Geral	Tvparanaturismo.br	1052	2026-06-11 19:56:16.729716+00
ea0ee12b-beee-41c5-95f9-1787fa747fec	BANDSPORTS FHDR¹	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	1053	2026-06-11 19:56:16.729716+00
00519042-1045-4881-9e45-d7fe35344e6b	44 GATOS | 24H+	https://googleplusimages.com/44GATOS.png	https://example.com/stream.m3u8	Geral	44gatos.24h	1054	2026-06-11 19:56:16.729716+00
7c7ca135-05f2-4b2a-b683-65bb181cfbe9	APENAS UM SHOW| 24H+	https://i.imgur.com/SbZyEZs.png	https://example.com/stream.m3u8	Geral	Apenasumshow.24h	1055	2026-06-11 19:56:16.729716+00
fa5619ae-9ed5-4f40-90db-0730f4e90411	24H KAMEN RIDER BLACK	https://i.imgur.com/dkttZ8f.png	https://example.com/stream.m3u8	Geral	Anime.br	1056	2026-06-11 19:56:16.729716+00
ecbfd5b4-1331-4954-a372-e0e6888908a9	APPLE TV+ HD²	https://googleplusimages.com/APPLETVPLUS.png	https://example.com/stream.m3u8	Geral	Appletvplus.br	1057	2026-06-11 19:56:16.729716+00
70a60ae8-8884-45e9-9a02-39a447a5f6b5	APPLE TV+ HD¹	https://googleplusimages.com/APPLETVPLUS.png	https://example.com/stream.m3u8	Geral	Appletvplus.br	1058	2026-06-11 19:56:16.729716+00
87c07181-5423-4c60-b226-570c12dc09dd	TV SUBAÉ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1059	2026-06-11 19:56:16.729716+00
67223ffe-b18e-46e0-8b26-41411f438b8d	TV PAI ETERNO HD¹	https://googleplusimages.com/TVPAIETERNO.png	https://example.com/stream.m3u8	Geral	Tvpaieterno.br	1060	2026-06-11 19:56:16.729716+00
d8e46876-1fe7-4705-af19-e754f3a90878	PLAYTV HD¹	https://googleplusimages.com/PLAYTV.png	https://example.com/stream.m3u8	Geral	Playtv.br	1061	2026-06-11 19:56:16.729716+00
f72d87db-acbc-4ec5-bb52-ce6cfb97b254	ESPN2 FHDR¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	1062	2026-06-11 19:56:16.729716+00
a8ae941f-2b8b-4c46-a9af-e99488e53b66	ESPN3 FHDR¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	1063	2026-06-11 19:56:16.729716+00
45b9b800-1ad8-4031-9246-4ec2daac70ca	TV CENTRO AMÉRICA FHDR¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1064	2026-06-11 19:56:16.729716+00
0716c171-4d88-4713-a132-b8ad054495af	TV GRANDE RIO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvgranderio.br	1065	2026-06-11 19:56:16.729716+00
c2070418-7aec-4f3d-a58b-e830d18df2cd	FUTEBOL PAULISTA 1 HD¹	https://googleplusimages.com/FUTEBOLPAULISTA.png	https://example.com/stream.m3u8	Geral	Futebolpaulista.br	1066	2026-06-11 19:56:16.729716+00
ccefa510-f1da-4be6-b687-d069805c6fb2	SONY MOVIES HD²	https://googleplusimages.com/SONYMOVIES.png	https://example.com/stream.m3u8	Filmes/Séries	Sonymovies.br	1067	2026-06-11 19:56:16.729716+00
a0adc632-bbc4-422d-b2fd-7970996b4f27	CNN BRASIL FHDR¹	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	1068	2026-06-11 19:56:16.729716+00
eec0de8d-66f1-42d9-9e2f-cfa0c40185cd	ESPN FHDR¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	1069	2026-06-11 19:56:16.729716+00
7b2c20df-de4c-4141-9ec9-00490b9efc8a	ESPN4 FHDR¹	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	1070	2026-06-11 19:56:16.729716+00
3515a750-9f01-474e-ad2a-9b89bb661260	SBT SP FHDR¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	1071	2026-06-11 19:56:16.729716+00
55e7cfa3-227e-41f8-821d-3768e9419da5	TNT FHDR¹	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	1072	2026-06-11 19:56:16.729716+00
ed2a53e8-a394-4b08-81e0-7c10b5d640c5	TELECINE PREMIUM FHDR¹	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	1073	2026-06-11 19:56:16.729716+00
95b14f7c-3e2f-492a-b88d-8704a4f0dad6	TELECINE PIPOCA FHDR¹	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	1074	2026-06-11 19:56:16.729716+00
769d6401-461b-426c-89dc-ce179374ca1c	TELECINE ACTION FHDR¹	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	1075	2026-06-11 19:56:16.729716+00
1f40150f-34cf-401f-98b1-92221dd85bbf	COMBATE HD¹	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	1076	2026-06-11 19:56:16.729716+00
898e5378-3449-4e6b-ad57-ac5860870a1b	TV VITÓRIA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordes.br	1077	2026-06-11 19:56:16.729716+00
c7e6fc92-d88c-450f-8baf-c986056dd7d5	TV CABO BRANCO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	1078	2026-06-11 19:56:16.729716+00
681680df-a590-4a8f-a71c-a4168f125acd	NSC TV BLUMENAU HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1079	2026-06-11 19:56:16.729716+00
d2c42491-4566-4d79-b5ef-092346ab1c0f	REDE AMAZÔNICA BOA VISTA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoac.br	1080	2026-06-11 19:56:16.729716+00
8ec7da73-43c8-49c0-9d51-9ab9d5e58bce	RBS TV BAGÉ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1081	2026-06-11 19:56:16.729716+00
a9dce722-70ba-4d2e-a20a-2e5bdf020666	RBS TV CRUZ ALTA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1082	2026-06-11 19:56:16.729716+00
f3aeb71d-c3a3-4429-8b5b-f030a14cb631	RBS TV ERECHIM HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1083	2026-06-11 19:56:16.729716+00
325ebe9c-0d37-4fcd-a4af-63d08dda503e	RBS TV RIO GRANDE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1084	2026-06-11 19:56:16.729716+00
70ecee0d-df24-4099-bdd9-af5fd77fcf40	RBS TV SANTA ROSA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1085	2026-06-11 19:56:16.729716+00
b766edb2-8ca4-4d47-925e-caa01b90d5e2	RBS TV URUGUAIANA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1086	2026-06-11 19:56:16.729716+00
066ba65a-d4b6-4e15-b136-9d50d21932db	REDE AMAZÔNICA PARINTINS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1087	2026-06-11 19:56:16.729716+00
be7ae184-e185-41b2-97ec-e7452085c751	REDE AMAZÔNICA PARINTINS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1088	2026-06-11 19:56:16.729716+00
1b6c44fe-d9f4-45fe-a5bc-2a2a9219c49b	REDE AMAZÔNICA MACAPÁ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoap.br	1089	2026-06-11 19:56:16.729716+00
ff7ec61a-adff-42eb-bd77-8c53236d7748	NSC TV CENTRO-OESTE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1090	2026-06-11 19:56:16.729716+00
50f303ed-a765-4e37-a492-5764d06e1150	NSC TV CENTRO-OESTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1091	2026-06-11 19:56:16.729716+00
f7eb59a8-7112-4ac0-bbfa-cd694a84bc9b	INTERTV PLANÍCIE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1092	2026-06-11 19:56:16.729716+00
79ceb14e-123a-4f37-a052-fc4bffd763af	INTERTV COSTA BRANCA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	1093	2026-06-11 19:56:16.729716+00
051b132a-c8ca-4032-bea6-9807039977e0	INTERTV COSTA BRANCA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	1094	2026-06-11 19:56:16.729716+00
69e0551e-d2e1-4a44-a31e-57702e40c749	EPTV RIBEIRÃO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1095	2026-06-11 19:56:16.729716+00
65be5ff1-a4eb-4db8-b966-1d1da1ca6010	EPTV CENTRAL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1096	2026-06-11 19:56:16.729716+00
9107cf50-0bfa-4626-bba2-29b70c88c51e	RPC GUARAPUAVA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1097	2026-06-11 19:56:16.729716+00
aa1c222e-61ff-477e-860f-a4148789531c	RPC LONDRINA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1098	2026-06-11 19:56:16.729716+00
7f4691ea-e61d-491a-9063-94a8610d5c22	RPC MARINGÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1099	2026-06-11 19:56:16.729716+00
a0fd2eac-f00c-4b4e-8ebe-1ad160bf6dda	TV ALVORADA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	1100	2026-06-11 19:56:16.729716+00
59d396e4-15ab-4c4a-8a50-194a3b36f6a9	TV ALVORADA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	1101	2026-06-11 19:56:16.729716+00
c222415a-4b53-4b22-8433-e91388ec9c68	TV CLUBE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	1102	2026-06-11 19:56:16.729716+00
9961b91f-e826-4af7-8c53-dd4571d1b1f3	TV ANHANGUERA PALMAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoto.br	1103	2026-06-11 19:56:16.729716+00
17d5a52f-86f5-4fc1-b3d3-12d4d3aed4a3	TV INTEGRAÇÃO UBERABA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1104	2026-06-11 19:56:16.729716+00
2c507dda-1c90-4bf8-a95b-2c0be26dde99	TV MORENA PONTA PORÃ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1105	2026-06-11 19:56:16.729716+00
91cfd464-218a-4521-abbd-b7651d801771	TV MORENA PONTA PORÃ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1106	2026-06-11 19:56:16.729716+00
475d0156-8cab-4a05-9e5a-5f770c565133	REDE AMAZÔNICA RORAINÓPOLIS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globorr.br	1107	2026-06-11 19:56:16.729716+00
f648888d-b933-4587-b331-44624425472e	REDE AMAZÔNICA COARI HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1108	2026-06-11 19:56:16.729716+00
18c15583-9047-4825-86ee-b7dd9834e429	REDE AMAZÔNICA HUMAITÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1109	2026-06-11 19:56:16.729716+00
355cd280-d689-4a71-8c39-0dd1c13a68ed	REDE AMAZÔNICA MANACAPURU HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1110	2026-06-11 19:56:16.729716+00
dccddcf6-a0f9-43c4-b167-482da103bc70	REDE AMAZÔNICA VILHENA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	1111	2026-06-11 19:56:16.729716+00
a8468303-e59c-4c08-8fc8-c4ac13db3236	REDE AMAZÔNICA JI-PARANÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	1112	2026-06-11 19:56:16.729716+00
f57671e3-8b03-43c1-9afb-bc9508b02ce6	REDE AMAZÔNICA ITACOATIARA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1113	2026-06-11 19:56:16.729716+00
372c5f2d-97ed-40dc-aa8d-6cb7a9fb4bda	REDE AMAZÔNICA CRUZEIRO DO SUL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoac.br	1114	2026-06-11 19:56:16.729716+00
4cbf9ea3-fca6-4170-af9c-a19e9992ba5c	REDE AMAZÔNICA CACOAL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	1115	2026-06-11 19:56:16.729716+00
59af44a4-7d6e-4926-ad63-4ca86e08364f	REDE AMAZÔNICA ARIQUEMES HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	1116	2026-06-11 19:56:16.729716+00
2c291c95-3039-4bc2-bb8f-8d1c8e8a1ef3	TV INTEGRAÇÃO ITUIUTABA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1117	2026-06-11 19:56:16.729716+00
c487f331-8f0b-4f18-98e3-dafc4a95bc51	TV INTEGRAÇÃO ITUIUTABA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1118	2026-06-11 19:56:16.729716+00
420841ab-b759-4492-9fa3-c0c090592bbe	TV INTEGRAÇÃO UBERLÂNDIA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1119	2026-06-11 19:56:16.729716+00
90801d04-c6c7-4f27-80a6-7f508fe935c9	TV ANHANGUERA ARAGUAINA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoto.br	1120	2026-06-11 19:56:16.729716+00
35c03fb2-9569-4a9e-8fbb-9f452759789c	TV ANHANGUERA RIO VERDE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1121	2026-06-11 19:56:16.729716+00
f40688d2-f8c2-44ed-848c-f8a8c0c397e7	TV ANHANGUERA PORANGATU HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1122	2026-06-11 19:56:16.729716+00
0d203f96-108c-4934-8e4f-d892de27bd3a	TV ANHANGUERA LUZIÂNIA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1123	2026-06-11 19:56:16.729716+00
faa75cd6-ff26-4e34-80d0-6a0bd522d7d9	TV ANHANGUERA JATAÍ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1124	2026-06-11 19:56:16.729716+00
5285a6f3-d75f-4eef-9a01-5ef14ed0f1ad	TV ANHANGUERA ITUMBIARA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1125	2026-06-11 19:56:16.729716+00
3f2d23b7-4a49-4a04-998a-2436bd3a59e5	TV ANHANGUERA GURUPI HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoto.br	1126	2026-06-11 19:56:16.729716+00
3393a66f-1d27-4e63-bd96-16c67dcbd622	TV ANHANGUERA CATALÃO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1127	2026-06-11 19:56:16.729716+00
2bfdef6b-20de-49b4-8f6f-86adca8c321b	TV ANHANGUERA ANÁPOLIS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1128	2026-06-11 19:56:16.729716+00
75fbd25a-19a2-4336-b40c-0013ca9dc45c	TV LIBERAL CASTANHAL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1129	2026-06-11 19:56:16.729716+00
6e2f43da-2b03-4d9f-9af5-82c7918c63ce	TV LIBERAL REDENÇÃO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1130	2026-06-11 19:56:16.729716+00
6753dc69-4a54-4f42-8495-05068c18dcc4	TV LIBERAL PARAGOMINAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1131	2026-06-11 19:56:16.729716+00
a0527f04-25ba-45cc-9f5e-44f4fd5149e5	TV LIBERAL PARAUAPEBAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1132	2026-06-11 19:56:16.729716+00
fd88468c-eb75-4601-a2e8-b8f9e07d2023	TV LIBERAL MARABÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1133	2026-06-11 19:56:16.729716+00
a6a24876-d1da-4252-9b23-740b7b85366d	TV LIBERAL ALTAMIRA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1134	2026-06-11 19:56:16.729716+00
6db81718-6698-4793-a1ce-070127050502	TV GRANDE RIO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvgranderio.br	1135	2026-06-11 19:56:16.729716+00
1fd534d9-c3b1-41d6-af33-0392034b1c9c	TV TAPAJÓS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtapajos.br	1136	2026-06-11 19:56:16.729716+00
748b2f6f-455d-4229-8894-22718974aa37	TV GAZETA NOROESTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1137	2026-06-11 19:56:16.729716+00
124a7597-9c99-4cf2-8b37-c638d7f1f68f	TV GAZETA NORTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1138	2026-06-11 19:56:16.729716+00
866c693a-e8b7-4e74-b80b-d37cdaa97d0f	TV SANTA CRUZ H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1139	2026-06-11 19:56:16.729716+00
e03915a1-62e2-4cac-9850-34378d9c2ce3	TV SUDOESTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1140	2026-06-11 19:56:16.729716+00
cc7fa6cd-452d-4a28-b0f0-18c580a93bce	TV SÃO FRANCISCO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1141	2026-06-11 19:56:16.729716+00
502e2ff1-06d0-4583-97ec-a348b1782a66	TV SÃO FRANCISCO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1142	2026-06-11 19:56:16.729716+00
993ff6c9-f53d-4116-81db-4b540cce00e6	TV OESTE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1143	2026-06-11 19:56:16.729716+00
ce95d5df-3de1-4081-b0a7-790aaef3bbe6	TV OESTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1144	2026-06-11 19:56:16.729716+00
d9a61f6d-044b-4b71-9368-9c6fbf3fdf91	TV PARAÍBA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	1145	2026-06-11 19:56:16.729716+00
5d283ff9-198b-4d8e-ae54-4002950c1632	TV MIRANTE IMPERATRIZ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1146	2026-06-11 19:56:16.729716+00
75dc92df-751e-4eec-8f8d-afaac489fe1e	TV MIRANTE IMPERATRIZ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1147	2026-06-11 19:56:16.729716+00
c20d703b-8e84-4875-bf72-9a25a3a7e4ee	TV MIRANTE BALSAS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1148	2026-06-11 19:56:16.729716+00
f3ca4172-0c86-4aa7-a40a-63beba64bcd1	TV MIRANTE BALSAS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1149	2026-06-11 19:56:16.729716+00
3f0f16a5-e208-47a4-8aa8-adcdd02615c1	TV MIRANTE COCAIS FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1150	2026-06-11 19:56:16.729716+00
30d85e48-2d80-4a0d-ab4d-7f84831380c8	TV MIRANTE COCAIS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1151	2026-06-11 19:56:16.729716+00
146f0c70-9625-4267-970b-b4d6c574cf66	TV MORENA CORUMBÁ FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1152	2026-06-11 19:56:16.729716+00
f79730e8-0823-4b2f-a0a9-67c02f93441f	TV MORENA CORUMBÁ HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1153	2026-06-11 19:56:16.729716+00
23376376-99da-4939-a351-0163f93232e2	TV CENTRO AMÉRICA NORTE FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1154	2026-06-11 19:56:16.729716+00
bc3856eb-1435-47c2-9281-38c98b52e200	TV CENTRO AMÉRICA NORTE HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1155	2026-06-11 19:56:16.729716+00
a8e06d67-8a54-43c6-a8c1-951cd86df61a	TV CENTRO AMÉRICA SUL FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1156	2026-06-11 19:56:16.729716+00
126da883-4577-488c-83e5-c071380f6a49	TV CENTRO AMÉRICA SUL HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1157	2026-06-11 19:56:16.729716+00
94375eae-6adf-45c7-a706-29425effb1fe	TV CENTRO AMÉRICA TANGARÁ DA SERRA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1158	2026-06-11 19:56:16.729716+00
ab3ac71d-612e-4f7f-9acb-a1cef69afedf	TV FRONTEIRA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvfronteirasp.br	1159	2026-06-11 19:56:16.729716+00
2f4ff75e-9e86-4af2-9d2a-2330b4546cc5	TV DIÁRIO CE HD²	https://googleplusimages.com/TVDIARIO.png	https://example.com/stream.m3u8	Geral	Tvdiarioce.br	1160	2026-06-11 19:56:16.729716+00
d577651e-9d47-44d1-9a07-8f3d5d15c8f5	ISTV HD+	https://googleplusimages.com/ISTV.png	https://example.com/stream.m3u8	Geral	ISTV.br	1161	2026-06-11 19:56:16.729716+00
523672a8-6783-45e7-a0f2-f66c85db6542	NSPORTS FHD¹	https://googleplusimages.com/NSPORTS.png	https://example.com/stream.m3u8	Geral	Nsports.br	1162	2026-06-11 19:56:16.729716+00
192b5b78-6dcb-41ef-9cd0-8f33439775b7	NSPORTS HD¹	https://googleplusimages.com/NSPORTS.png	https://example.com/stream.m3u8	Geral	Nsports.br	1163	2026-06-11 19:56:16.729716+00
479efe31-4e30-43ae-bbc6-589ad6ff1e46	DISNEY+ 4 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	1164	2026-06-11 19:56:16.729716+00
93481ee8-1253-4e8b-92f0-eb9d23cd201d	DISNEY+ 5 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	1165	2026-06-11 19:56:16.729716+00
723a239f-1947-42d5-964b-ea0ebf64d97d	DISNEY+ 6 HD²	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	1166	2026-06-11 19:56:16.729716+00
8e83c2bf-20d5-4809-9cc5-957c66d6d27d	CANCAO NOVA FHD¹	https://googleplusimages.com/CANCAONOVA.png	https://example.com/stream.m3u8	Geral	Cancaonova.br	1167	2026-06-11 19:56:16.729716+00
176bd0a2-debd-48ed-8a7d-fc1496714ad5	TV5 MONDE AMERIQUE LATINE	https://googleplusimages.com/TV5MONDEAL.png	https://example.com/stream.m3u8	Geral	Tv5monde.br	1168	2026-06-11 19:56:16.729716+00
16467115-8a5f-4797-93d1-5b085090a7f9	UNIVERSAL PREMIERE HD¹	https://googleplusimages.com/UNIVERSALPLUS.png	https://example.com/stream.m3u8	Esportes	Universalpremiere.br	1169	2026-06-11 19:56:16.729716+00
acc192a2-9602-42e1-b27b-8348ef41fc1b	UNIVERSAL REALITY HD+	https://googleplusimages.com/UNIVERSALPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Universalreality.br	1170	2026-06-11 19:56:16.729716+00
14491f3c-e280-4cb0-a52e-051d672dc8ba	BAND CEARÁ HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandce.br	1171	2026-06-11 19:56:16.729716+00
4d7addd4-0318-458e-9fe9-027f04efaf1d	CANAL BRASIL FHD¹	https://googleplusimages.com/CANALBRASIL.png	https://example.com/stream.m3u8	Geral	Canalbrasil.br	1172	2026-06-11 19:56:16.729716+00
63d44ab1-0176-4ac0-a3a3-36deb0b5302a	TH+ RECORD CAMPINAS HD+	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Threcordcampinas.br	1173	2026-06-11 19:56:16.729716+00
dd0a70ac-0904-43d2-ac6e-a0bb2ab7bab3	[LEG] HBO FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	1174	2026-06-11 19:56:16.729716+00
36142b50-0c55-4a00-acdf-350934f901b2	[LEG] HBO HD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	1175	2026-06-11 19:56:16.729716+00
7325aba1-69fd-4840-bd4e-5f7bee17c024	GNT FHDR²	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	1176	2026-06-11 19:56:16.729716+00
473c1374-8a54-41bb-b04b-eef1c2c45b55	AXN FHDR²	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	1177	2026-06-11 19:56:16.729716+00
7d48f33e-d5ed-4510-bec6-57a4990a3111	A&E FHDR²	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	1178	2026-06-11 19:56:16.729716+00
c8c770ee-8cfa-4d50-815f-557864715cb1	GLOBO MINAS H265¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globomg.br	1179	2026-06-11 19:56:16.729716+00
d194de8d-da80-4e30-a499-ea64013782f0	RBS TV PORTO ALEGRE FHDR²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1180	2026-06-11 19:56:16.729716+00
43f7ec26-7a68-44ec-aa7a-5b95d33f1486	CAMERAS ESCONDIDAS | 24H+	http://googleplusimages.com/CAMERASESCONDIDAS.png	https://example.com/stream.m3u8	Geral	Camerasescondidas.24h	1181	2026-06-11 19:56:16.729716+00
520b39b0-73d2-40f1-9bef-3a235268ad64	LADY NIGHT T1 | 24H+	https://googleplusimages.com/LADYNIGHT.png	https://example.com/stream.m3u8	Geral	Ladynight.24h	1182	2026-06-11 19:56:16.729716+00
6618e5be-588d-43f6-be50-0ff0c0448132	LARGADOS E PELADOS | 24H+	https://googleplusimages.com/LARGADOSEPELADOS.png	https://example.com/stream.m3u8	Geral	Largadosepelados.24h	1183	2026-06-11 19:56:16.729716+00
49127152-926e-47fe-8f1b-8f0edfe582a5	IRMAOS A OBRA | 24H+	https://googleplusimages.com/IRMAOSAOBRA.png	https://example.com/stream.m3u8	Geral	Irmaosaobra.24h	1184	2026-06-11 19:56:16.729716+00
508a99fe-3a5d-464b-b623-f6bec4555dfd	CHAVES EM DESENHO | 24H+	https://googleplusimages.com/CHAVESDESENHO.png	https://example.com/stream.m3u8	Geral	Chavesdesenho.24h	1185	2026-06-11 19:56:16.729716+00
1575bea1-dde6-4702-8e6d-2acc521d4103	DESENHOS DO NOVO TESTAMENTO | 24H+	https://googleplusimages.com/BIBLIAANIMADA.png	https://example.com/stream.m3u8	Geral	Desenhosnovotestamento.24h	1186	2026-06-11 19:56:16.729716+00
c3c158d2-96ec-40b2-b1c3-e859f39b05ce	DESENHOS DO VELHO TESTAMENTO | 24H+	https://googleplusimages.com/BIBLIAANIMADA.png	https://example.com/stream.m3u8	Geral	Desenhosvelhotestamento.24h	1187	2026-06-11 19:56:16.729716+00
fbe0e7b9-07ab-4695-8262-9d5c18c2de88	CHAVES | 24H+	https://googleplusimages.com/CHAVES.png	https://example.com/stream.m3u8	Geral	Chaves.24h	1188	2026-06-11 19:56:16.729716+00
c0c4b206-0724-4ba3-a288-0a30cf0f78a3	DRAGON BALL Z KAI | 24H+	https://googleplusimages.com/DBZKAI.png	https://example.com/stream.m3u8	Geral	Dbzk.24h	1189	2026-06-11 19:56:16.729716+00
a2189b12-3fd1-42a7-9f14-a4f80fe252b8	DRAGON BALL Z | 24H+	https://googleplusimages.com/DBZ.png	https://example.com/stream.m3u8	Geral	Dbz.24h	1190	2026-06-11 19:56:16.729716+00
a7548ade-9dff-4af2-abd3-806c3edb1a79	DRAGON BALL SUPER | 24H+	https://googleplusimages.com/DBSUPER.png	https://example.com/stream.m3u8	Geral	Dbsuper.24h	1191	2026-06-11 19:56:16.729716+00
c4803a6d-fd6e-4740-82b3-ae66ca9265d1	SUPER DRAGON BALL HEROES |24H+	https://googleplusimages.com/DBHEROES.png	https://example.com/stream.m3u8	Geral	Superdbheroes.24h	1192	2026-06-11 19:56:16.729716+00
7ff34b1a-a9f7-45f5-8f7b-9c7ca23f6409	DRAGON BALL GT | 24H+	https://googleplusimages.com/DBGT.png	https://example.com/stream.m3u8	Geral	Dbgt.24h	1193	2026-06-11 19:56:16.729716+00
2cc95475-71b6-4d37-854e-c83e4b6d1acd	DRAGON BALL | 24H+	https://googleplusimages.com/DB.png	https://example.com/stream.m3u8	Geral	Dragonball.24h	1194	2026-06-11 19:56:16.729716+00
94bd7186-c949-495e-926e-1faa900ca4d5	TV A CRITICA HD¹	https://googleplusimages.com/TVACRITICA.png	https://example.com/stream.m3u8	Geral	Tvacritica.br	1195	2026-06-11 19:56:16.729716+00
deae2a5f-98cc-42f9-b606-c893c0d81690	CASTLEVANIA | 24H+	https://googleplusimages.com/CASTLEVANIA.png	https://example.com/stream.m3u8	Geral	Castlevania.24h	1196	2026-06-11 19:56:16.729716+00
ab21ebdf-2bf1-4ffe-afb4-076d0cd40d7f	DEMON SLAYER | 24H+	https://googleplusimages.com/DEMONSLAYER.png	https://example.com/stream.m3u8	Geral	Demonslayer: Kimetsu no Yaiba.24h	1197	2026-06-11 19:56:16.729716+00
56496d43-a00e-43a3-83d5-eb9071e3f8a1	BEYBLADE | 24H+	https://googleplusimages.com/BEYBLADE.png	https://example.com/stream.m3u8	Geral	Beyblade.24h	1198	2026-06-11 19:56:16.729716+00
f07d41f8-5f5c-4252-a607-78e704d854cf	PATRULHA CANINA | 24H+	https://googleplusimages.com/PATRULHACANINA.png	https://example.com/stream.m3u8	Geral	Patrulhacanina.24h	1199	2026-06-11 19:56:16.729716+00
743c700e-dfe3-42b5-bd2b-8b453a5d9947	A GRANDE FAMILIA | 24H+	https://googleplusimages.com/LINEU.png	https://example.com/stream.m3u8	Geral	Agrandefamilia.24h	1200	2026-06-11 19:56:16.729716+00
6d9285ac-5709-4da1-8dce-04e545152afa	AS VISOES DA RAVEN | 24H+	https://googleplusimages.com/ASVISOESDARAVEN.png	https://example.com/stream.m3u8	Geral	Asvisoesdaraven.24h	1201	2026-06-11 19:56:16.823739+00
d55717d7-6e95-4891-a6c6-2f96bcb94897	BOBS BURGERS | 24H+	https://googleplusimages.com/BOBSBURGERS.png	https://example.com/stream.m3u8	Geral	Bobsburgers.24h	1202	2026-06-11 19:56:16.823739+00
136fe2c1-019a-4d03-9635-51c3918632ed	RICK AND MORTY | 24H+	https://googleplusimages.com/RICKANDMORTY.png	https://example.com/stream.m3u8	Geral	Rickandmorty.24h	1203	2026-06-11 19:56:16.823739+00
b9d600c2-fffa-4a3b-8826-1130a61398ba	TODO MUNDO ODEIA O CHRIS | 24H+	https://googleplusimages.com/CHRIS.png	https://example.com/stream.m3u8	Geral	Chris.24h	1204	2026-06-11 19:56:16.823739+00
6f52717c-6436-4fa0-8f5b-986c0dcf17f8	TV ANHANGUERA GOIÂNIA H265²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1205	2026-06-11 19:56:16.823739+00
cfa3f08a-717a-4a2b-b779-8955a2cc6499	TV VERDES MARES CARIRI FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	1206	2026-06-11 19:56:16.823739+00
a508c7f3-ad69-405f-8cab-15cbe27fd297	TV MIRANTE SÃO LUÍS HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1207	2026-06-11 19:56:16.823739+00
af9868e9-07d4-4d74-ae19-5880efe6c180	REDE AMAZÔNICA RIO BRANCO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoac.br	1208	2026-06-11 19:56:16.823739+00
e682f77f-f70b-487e-a0cc-7f39a308d473	AS AVENTURAS DE JIMMY NEUTRON | 24H+	https://googleplusimages.com/JIMMYNEUTRON.png	https://example.com/stream.m3u8	Geral	Jimmyneutron.24h	1209	2026-06-11 19:56:16.823739+00
3fe7fe17-3d5d-465a-bce9-e90eead69f21	CATDOG | 24H+	https://googleplusimages.com/CATDOG.png	https://example.com/stream.m3u8	Geral	Catdog.24h	1210	2026-06-11 19:56:16.823739+00
d79b701b-28c8-4678-9a98-3dd25992203c	A FAMILIA RADICAL: MAIOR E MELHOR | 24H+	https://googleplusimages.com/PENNY2.png	https://example.com/stream.m3u8	Geral	AFamiliaradical.24h	1211	2026-06-11 19:56:16.823739+00
0d50e2f9-73b0-4809-94f5-5994f3048392	A LENDA DOS TRES CABALLEROS | 24H+	https://googleplusimages.com/ZECARIOCA.png	https://example.com/stream.m3u8	Geral	3caballeros.24h	1212	2026-06-11 19:56:16.823739+00
7119ad86-a1b1-43e1-a766-f43488f95d8c	AS AVENTURAS DE PADDINGTON (2019) | 24H+	https://googleplusimages.com/PADDINGTON.png	https://example.com/stream.m3u8	Geral	Paddington.24h	1213	2026-06-11 19:56:16.823739+00
9d271dc2-0cd5-4b10-852a-d049f7820406	ANA PIMENTINHA  | 24H+	https://googleplusimages.com/PIMENTINHA.png	https://example.com/stream.m3u8	Geral	Anapimentinha.24h	1214	2026-06-11 19:56:16.823739+00
3d663086-96ab-48ce-9abe-ad8a68bba8cb	ANGRY BIRDS: LOUCURAS DE VERAO  |24H+	https://googleplusimages.com/ANGRYBIRDS.png	https://example.com/stream.m3u8	Geral	Angrybirds.24h	1215	2026-06-11 19:56:16.823739+00
d86d5cdf-22a3-48e6-b598-b08323e6bcd4	ALVINNN E OS ESQUILOS  | 24H+	https://googleplusimages.com/ALVINNN.png	https://example.com/stream.m3u8	Geral	Alvinnn.24h	1216	2026-06-11 19:56:16.823739+00
8e100805-350e-422c-bc24-c2b2521afbec	RUGRATS: OS ANJINHOS (1991) | 24H+	https://googleplusimages.com/RUGRATS.png	https://example.com/stream.m3u8	Geral	Rugrats.24h	1217	2026-06-11 19:56:16.823739+00
fe231134-82c2-420a-bc99-fd7d001d9ed1	100% LOBO | 24H+	https://googleplusimages.com/100LOBO.png	https://example.com/stream.m3u8	Geral	100lobo.24h	1218	2026-06-11 19:56:16.823739+00
123f0de0-aa3e-4806-a398-fc8cfc41fff9	TOM E JERRY EM NOVA YORK | 24H+	https://googleplusimages.com/TOMEJERRYNY.png	https://example.com/stream.m3u8	Geral	Tomejerryny.24h	1219	2026-06-11 19:56:16.823739+00
ae5bce08-160a-43fb-b4e8-6b54c51bd46d	MIRACULOUS: AS AVENTURAS DE LADYBUG | 24H+	https://googleplusimages.com/LADYBUG.png	https://example.com/stream.m3u8	Geral	Ladybug.24h	1220	2026-06-11 19:56:16.823739+00
29497b59-0b15-4b97-bd46-a9c0fcde6770	OS CACA FANTASMAS | 24H+	https://googleplusimages.com/GHOSTBUSTERS.png	https://example.com/stream.m3u8	Geral	Cacafantasmas.24h	1221	2026-06-11 19:56:16.823739+00
81b31bd5-c9eb-42b5-9adf-a4c8b7c048fd	A CASA MAGICA DA GABBY | 24H+	https://googleplusimages.com/GABBY.png	https://example.com/stream.m3u8	Geral	Acasadagabby.24h	1222	2026-06-11 19:56:16.823739+00
85d4b874-2086-4ef3-be49-4ce701962cbc	SCOOBY DOO E SCOOBY LOO | 24H+	https://googleplusimages.com/SCOOBYLOO.png	https://example.com/stream.m3u8	Geral	Scoobydooescoobyloo.24h	1223	2026-06-11 19:56:16.823739+00
baa5a0b8-6d3a-4a12-91b4-490105c7e598	KICK BUTTOWSKI: UM PROJETO DE DUBLE |24H+	https://googleplusimages.com/KICKBUTTOWSKI.png	https://example.com/stream.m3u8	Geral	Kickbuttowski.24h	1224	2026-06-11 19:56:16.823739+00
090fb129-2790-4cc9-ad7a-6f4a12cbfc57	TV SENADO HD¹	https://googleplusimages.com/TVSENADO.png	https://example.com/stream.m3u8	Geral	Tvsenado.br	1225	2026-06-11 19:56:16.823739+00
368090ec-1867-4252-bdf1-7b21e3f835ec	PLAYTV HD°	https://googleplusimages.com/PLAYTV.png	https://example.com/stream.m3u8	Geral	Playtv.br	1226	2026-06-11 19:56:16.823739+00
0386a2f3-b0b7-4617-b3f1-c7d9ea7af003	TV JUSTIÇA HD¹	https://googleplusimages.com/TVJUSTICA.png	https://example.com/stream.m3u8	Geral	Tvjustica.br	1227	2026-06-11 19:56:16.823739+00
ef6c20ed-f60e-4dec-81b2-a74f4dff3e52	RECORD MINAS FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordmg.br	1228	2026-06-11 19:56:16.823739+00
26d48ec6-c62f-491c-98c5-476664e3c36c	TRACE BRASIL HD°	https://googleplusimages.com/TRACEBRASIL.png	https://example.com/stream.m3u8	Geral	Tracebr.br	1229	2026-06-11 19:56:16.823739+00
8a9d07a0-b665-4f51-b290-e0a8a68943f8	PREMIERE 7 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere7.br	1230	2026-06-11 19:56:16.823739+00
56aaec60-ad1f-48bb-9dc1-4c67adf559ea	PREMIERE 6 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere6.br	1231	2026-06-11 19:56:16.823739+00
6f7c26fe-b654-418a-91ba-a2b2b8e9ce45	PREMIERE 5 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere5.br	1232	2026-06-11 19:56:16.823739+00
9f06ac3d-c118-44ac-96ed-7a014a5a5240	PREMIERE 4 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere4.br	1233	2026-06-11 19:56:16.823739+00
a3b9501a-c82e-44f9-93f2-b800c9748b40	PREMIERE 3 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere3.br	1234	2026-06-11 19:56:16.823739+00
56cac263-674f-4940-9906-0df748018fc0	PREMIERE 2 FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	1235	2026-06-11 19:56:16.823739+00
7957c13b-7847-4e7a-87df-2486b00e6f5e	PREMIERE CLUBES FHD²	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	1236	2026-06-11 19:56:16.823739+00
e074df2d-524c-4cd7-a6cb-cb0ab80826c7	SPORTV 3 FHD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	1237	2026-06-11 19:56:16.823739+00
10a816c6-a2ce-4a80-94d0-7116b8dff34a	SPORTV 2 FHD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	1238	2026-06-11 19:56:16.823739+00
45d5e3ec-158f-4931-93be-f7a297969d30	SPORTV FHD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	1239	2026-06-11 19:56:16.823739+00
9ae9019f-40ac-4f6e-878a-dfcbc7e414c8	ESPN6 FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn6.br	1240	2026-06-11 19:56:16.823739+00
6d48ffb3-0fde-4902-bf85-b774c6b604dc	ESPN5 FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	1241	2026-06-11 19:56:16.823739+00
8d2e3dce-8d27-4c41-9c7a-6f15b424ed44	ESPN4 FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	1242	2026-06-11 19:56:16.823739+00
89cf30ed-a4e2-41c9-8db3-46abe5424071	ESPN3 FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	1243	2026-06-11 19:56:16.823739+00
5eb63367-41ba-47f4-a0f6-4303c2bf5d1d	ESPN2 FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	1244	2026-06-11 19:56:16.823739+00
5b2cc3bc-88c1-4204-8f4d-e478ac59ca9c	ESPN FHD²	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	1245	2026-06-11 19:56:16.823739+00
ab71eaee-a9db-46a4-b38e-94869a4b66f9	TOONCAST HD²	https://i.imgur.com/yJF7wSp.png	https://example.com/stream.m3u8	Infantil	Tooncast.br	1246	2026-06-11 19:56:16.823739+00
6f64aea0-42e2-417c-9487-2dbf8504a759	TOONCAST HD¹	https://i.imgur.com/yJF7wSp.png	https://example.com/stream.m3u8	Infantil	Tooncast.br	1247	2026-06-11 19:56:16.823739+00
9d644a4d-782b-449d-8ed1-ac74800fb027	TOONCAST FHD²	https://i.imgur.com/yJF7wSp.png	https://example.com/stream.m3u8	Infantil	Tooncast.br	1248	2026-06-11 19:56:16.823739+00
b82d6a4a-6d2e-46e7-a4f4-2d12584805c4	REDE AMAZÔNICA BOA VISTA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globorr.br	1249	2026-06-11 19:56:16.823739+00
50447719-c507-4a31-80f0-bb730d5a512a	INTERTV ALTO LITORAL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1250	2026-06-11 19:56:16.823739+00
bd7c4174-50e7-44e7-a8eb-8632f7dce3ee	INTERTV SERRA+MAR HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1251	2026-06-11 19:56:16.823739+00
ed210175-fe7b-4c96-86b0-091fad650b20	INTERTV PLANÍCIE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1252	2026-06-11 19:56:16.823739+00
f9fe7936-0917-4b64-92f5-981b920f635c	TV RIO SUL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvriosul.br	1253	2026-06-11 19:56:16.823739+00
0ff1ae41-f737-4498-ab93-7623ebbcecf3	RECORD PAULISTA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordpaulista.br	1254	2026-06-11 19:56:16.823739+00
6b2e2614-c273-4897-83f8-4fe0188c016e	RECORD PAULISTA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordpaulista.br	1255	2026-06-11 19:56:16.823739+00
0e09e577-cd28-4ed5-a98e-37f38717e64d	GLOBO RIO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	1256	2026-06-11 19:56:16.823739+00
2496d919-6133-4691-9096-7bb3bbcffa36	GLOBO SP FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	1257	2026-06-11 19:56:16.823739+00
ed434e12-d634-42db-8391-6a3a1696f041	GLOBO SP H265²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globosp.br	1258	2026-06-11 19:56:16.823739+00
fef81d24-7618-4731-b74c-23c10404aafa	GLOBO BRASÍLIA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globodf.br	1259	2026-06-11 19:56:16.823739+00
50968073-30d0-49b5-949d-ab4e89e7876a	GLOBO MINAS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globomg.br	1260	2026-06-11 19:56:16.823739+00
6d1a26c1-67cd-4462-9720-5da1d1a0d127	GLOBO NORDESTE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globope.br	1261	2026-06-11 19:56:16.823739+00
54ef21ff-d29a-4666-bbc6-96f2a5ec99c7	TELECINE TOUCH FHD²	https://googleplusimages.com/TCTOUCH.png	https://example.com/stream.m3u8	Filmes/Séries	Tctouch.br	1262	2026-06-11 19:56:16.823739+00
b253d4d6-6aee-4b05-93a0-169c58b53e00	TELECINE PREMIUM FHD²	https://googleplusimages.com/TCPREMIUM.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpremium.br	1263	2026-06-11 19:56:16.823739+00
1df52a82-3472-4187-b865-09cd35fc36bf	TELECINE PIPOCA FHD²	https://googleplusimages.com/TCPIPOCA.png	https://example.com/stream.m3u8	Filmes/Séries	Tcpipoca.br	1264	2026-06-11 19:56:16.823739+00
699f4138-1998-4e62-8929-df200daf9999	TELECINE ACTION FHD²	https://googleplusimages.com/TCACTION.png	https://example.com/stream.m3u8	Filmes/Séries	Tcaction.br	1265	2026-06-11 19:56:16.823739+00
29ad29a6-ee21-4815-a1bb-de0a1d84fbc3	TELECINE FUN FHD²	https://googleplusimages.com/TCFUN.png	https://example.com/stream.m3u8	Filmes/Séries	Tcfun.br	1266	2026-06-11 19:56:16.823739+00
bea79376-75d6-4874-b63e-43cf4a567fbd	TELECINE CULT FHD²	https://googleplusimages.com/TCCULT.png	https://example.com/stream.m3u8	Filmes/Séries	Tccult.br	1267	2026-06-11 19:56:16.823739+00
6de3f038-1caf-4a95-8df5-32c39a680224	HBO FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	1268	2026-06-11 19:56:16.823739+00
3ee1626c-3c9a-488d-98c2-5ec1b3b6e304	HBO 2 FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	1269	2026-06-11 19:56:16.823739+00
6dfa9ae3-e0b1-4f0c-8a2c-23f011e9d9a9	HBO FAMILY FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	1270	2026-06-11 19:56:16.823739+00
bb4b960c-eac4-44f7-8529-e6e24fa37092	HBO SIGNATURE FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	1271	2026-06-11 19:56:16.823739+00
af742a56-629d-4abb-88c4-202f11234a45	HBO MUNDI FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbomundi.br	1272	2026-06-11 19:56:16.823739+00
9539f408-b9c9-471f-af0f-2590c07a2df3	HBO XTREME FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboxtreme.br	1273	2026-06-11 19:56:16.823739+00
bc6720fc-1a06-4a10-87f6-7f07684d8215	HBO POP FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbopop.br	1274	2026-06-11 19:56:16.823739+00
e34094b8-0b5b-4961-81c2-96f8edd8c9f2	HBO + FHD²	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hboplus.br	1275	2026-06-11 19:56:16.823739+00
929f0caf-bbdf-49f7-9f36-87b5687bcb43	RECORD NEWS FHD²	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Abertos	Recordnews.br	1276	2026-06-11 19:56:16.823739+00
edaa58ad-fd33-4a56-a6ec-a421aa5ab8e8	GLOBONEWS FHD²	https://googleplusimages.com/GLOBONEWS.png	https://example.com/stream.m3u8	Abertos	Globonews.br	1277	2026-06-11 19:56:16.823739+00
9a1f5023-19f7-4011-b878-e4651948d48a	BANDNEWS TV FHD²	https://googleplusimages.com/BANDNEWSTV.png	https://example.com/stream.m3u8	Abertos	Bandnews.br	1278	2026-06-11 19:56:16.823739+00
b0972042-277e-4a33-9f44-9ea062075c99	CNN BRASIL FHD²	https://googleplusimages.com/CNNBRASIL.png	https://example.com/stream.m3u8	Notícias	Cnn.br	1279	2026-06-11 19:56:16.823739+00
c9e8aa57-cbe7-48db-a9db-ae1450b02763	JP NEWS FHD²	https://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	1280	2026-06-11 19:56:16.823739+00
321bab90-1967-44de-8261-4305ee87ac1e	CNN EN ESPAÑOL HD²	https://googleplusimages.com/CNNENESPANOL.png	https://example.com/stream.m3u8	Notícias	Cnnes.br	1281	2026-06-11 19:56:16.823739+00
0a6cb9f5-6b28-4b85-9441-55e096b7da31	CNN INTERNATIONAL HD²	https://googleplusimages.com/CNNINTERNATIONAL.png	https://example.com/stream.m3u8	Notícias	Cnnint.br	1282	2026-06-11 19:56:16.823739+00
64327d3b-632f-4f98-88dc-33c943775aef	[JP] NHK WORLD-JAPAN FHD²	https://i.imgur.com/2JA5BIs.png	https://example.com/stream.m3u8	Geral	Nhkworld.br	1283	2026-06-11 19:56:16.823739+00
b308287e-692f-4212-a810-2e1971a357e8	CARTOONITO FHD²	https://googleplusimages.com/CARTOONITO.png	https://example.com/stream.m3u8	Infantil	Cartoonito.br	1284	2026-06-11 19:56:16.823739+00
3634c66b-4163-483f-951c-7e3d445c1bc1	TV RÁ TIM BUM FHD²	https://googleplusimages.com/TVRaTIMBUM.png	https://example.com/stream.m3u8	Geral	Tvratimbum.br	1285	2026-06-11 19:56:16.823739+00
46b59517-525b-4ae8-8372-15b805215688	CARTOON NETWORK FHD²	https://googleplusimages.com/CARTOONNETWORK.png	https://example.com/stream.m3u8	Infantil	Cartoonnetwork.br	1286	2026-06-11 19:56:16.823739+00
5dc48650-2e9b-4cca-a769-9325f0e57fff	GLOOB FHD²	https://googleplusimages.com/GLOOB.png	https://example.com/stream.m3u8	Infantil	Gloob.br	1287	2026-06-11 19:56:16.823739+00
411fe9d0-88e7-4029-9da9-46277d2550b6	DUMDUM FHD²	https://googleplusimages.com/DUMDUM.png	https://example.com/stream.m3u8	Geral	Dumdum.br	1288	2026-06-11 19:56:16.823739+00
1c1e373a-9807-4b2b-bff1-2ec51a4e7294	BIS FHD²	https://googleplusimages.com/BIS.png	https://example.com/stream.m3u8	Variedades/Música	Bis.br	1289	2026-06-11 19:56:16.823739+00
673ff9d9-b251-441f-a3eb-6a044aa6fed1	TLC FHD²	https://googleplusimages.com/TLC.png	https://example.com/stream.m3u8	Documentários	Tlc.br	1290	2026-06-11 19:56:16.823739+00
dc605835-4d0e-4d9f-9525-4245a120e617	MULTISHOW FHD²	https://googleplusimages.com/MULTISHOW.png	https://example.com/stream.m3u8	Variedades/Música	Multishow.br	1291	2026-06-11 19:56:16.823739+00
c681bcaa-27f4-4d6c-97bb-e43e02574cc2	GNT FHD²	https://googleplusimages.com/GNT.png	https://example.com/stream.m3u8	Variedades/Música	Gnt.br	1292	2026-06-11 19:56:16.823739+00
d05b8478-6f82-4bdc-a723-5e6844658e8f	E! FHD²	https://googleplusimages.com/E!.png	https://example.com/stream.m3u8	Variedades/Música	E.br	1293	2026-06-11 19:56:16.823739+00
3ac5b0ad-90a1-44ca-abe1-044379e965c7	HGTV FHD²	https://googleplusimages.com/HGTV.png	https://example.com/stream.m3u8	Geral	Hgtv.br	1294	2026-06-11 19:56:16.823739+00
529d1362-2be0-469a-a427-c39d5052b232	DISCOVERY HOME & HEALTH FHD²	https://googleplusimages.com/DISCOVERYHOME&HEALTH.png	https://example.com/stream.m3u8	Documentários	Discoveryhomehealth.br	1295	2026-06-11 19:56:16.823739+00
33d03052-5ee1-47a5-815f-da7fe5ff48ec	GLOBOPLAY NOVELAS FHD²	https://googleplusimages.com/GPLAYNOVELAS.png	https://example.com/stream.m3u8	Abertos	Globoplaynovelas.br	1296	2026-06-11 19:56:16.823739+00
0dfb89e4-093d-4b4e-8e5d-aadb4b04cb0b	BANDSPORTS FHD²	https://googleplusimages.com/BANDSPORTS.png	https://example.com/stream.m3u8	Esportes	Bandsports.br	1297	2026-06-11 19:56:16.823739+00
62f8406a-8250-408a-9529-170a43977425	CANAL OFF FHD²	https://googleplusimages.com/CANALOFF.png	https://example.com/stream.m3u8	Documentários	Off.br	1298	2026-06-11 19:56:16.823739+00
bfef9da6-6c82-49d7-81a8-2c9338c8b570	WOOHOO FHD²	https://googleplusimages.com/WOOHOO.png	https://example.com/stream.m3u8	Geral	Woohoo.br	1299	2026-06-11 19:56:16.823739+00
6fa90c36-91e1-42b7-b0e2-ef2cc21a0090	GOLF CHANNEL HD²	https://i.imgur.com/SmwGekQ.png	https://example.com/stream.m3u8	Geral	Golf.br	1300	2026-06-11 19:56:16.823739+00
b480c08b-c063-4527-aa56-800c4a1b61d1	ANIMAL PLANET FHD²	https://googleplusimages.com/ANIMALPLANET.png	https://example.com/stream.m3u8	Documentários	Animalplanet.br	1301	2026-06-11 19:56:16.823739+00
1d44ced1-7a42-437e-aba1-375def12b955	DISCOVERY CHANNEL FHD²	https://googleplusimages.com/DISCOVERYCHANNEL.png	https://example.com/stream.m3u8	Documentários	Discovery.br	1302	2026-06-11 19:56:16.823739+00
b49fed96-d862-40e1-8d2a-1fc458149a28	DISCOVERY SCIENCE FHD²	https://googleplusimages.com/DISCOVERYSCIENCE.png	https://example.com/stream.m3u8	Documentários	Discscience.br	1303	2026-06-11 19:56:16.823739+00
1032d5ef-4ffe-454f-84c0-664dd9a46426	DISCOVERY THEATER FHD²	https://googleplusimages.com/DISCOVERYTHEATER.png	https://example.com/stream.m3u8	Documentários	Disctheater.br	1304	2026-06-11 19:56:16.823739+00
78e484ed-b750-4f36-b81e-074489cf6078	DISCOVERY TURBO FHD²	https://googleplusimages.com/DISCOVERYTURBO.png	https://example.com/stream.m3u8	Documentários	Discturbo.br	1305	2026-06-11 19:56:16.823739+00
07eca891-630b-4c13-9d71-67e7e9b326dc	Discovery World FHD²	https://googleplusimages.com/DISCOVERYWORLD.png	https://example.com/stream.m3u8	Documentários	Discworld.br	1306	2026-06-11 19:56:16.823739+00
8a0bf356-0cb6-4bf1-8e89-90286a74894b	INVESTIGAÇÃO DISCOVERY FHD²	https://googleplusimages.com/ID.png	https://example.com/stream.m3u8	Documentários	Id.br	1307	2026-06-11 19:56:16.823739+00
e9ca860d-48e6-4de1-a78d-07af3e84014c	HISTORY FHD²	https://googleplusimages.com/HISTORY.png	https://example.com/stream.m3u8	Documentários	History.br	1308	2026-06-11 19:56:16.823739+00
00f884fb-26a5-4771-8217-dbb11124fc08	HISTORY 2 FHD²	https://i.imgur.com/JOmLdYI.png	https://example.com/stream.m3u8	Documentários	History2.br	1309	2026-06-11 19:56:16.823739+00
e314f4a7-6017-4bfd-ac1a-c5bd710a6afd	MODO VIAGEM FHD²	https://googleplusimages.com/MODOVIAGEM.png	https://example.com/stream.m3u8	Geral	Modoviagem.br	1310	2026-06-11 19:56:16.823739+00
55e96dcd-068e-4bbe-bd47-cb1a763621df	ARTE 1 FHD²	https://googleplusimages.com/ARTE1.png	https://example.com/stream.m3u8	Documentários	Arte1.br	1311	2026-06-11 19:56:16.823739+00
4f52cd85-8eb5-404a-bf95-4d15f2e64cc8	TNT FHD²	https://googleplusimages.com/TNT.png	https://example.com/stream.m3u8	Filmes/Séries	Tnt.br	1312	2026-06-11 19:56:16.823739+00
88308c63-01c7-40d5-9ed2-15579fc5edf0	TNT SÉRIES FHD²	https://googleplusimages.com/TNTSERIES.png	https://example.com/stream.m3u8	Filmes/Séries	Tntseries.br	1313	2026-06-11 19:56:16.823739+00
0614766b-307d-47e0-8082-583219ebf0e4	TNT NOVELAS FHD²	https://googleplusimages.com/TNTNOVELAS.png	https://example.com/stream.m3u8	Filmes/Séries	Tntnovelas.br	1314	2026-06-11 19:56:16.823739+00
9c4d0df0-5c3e-41be-821c-c5556a649e4b	SPACE FHD²	https://googleplusimages.com/SPACE.png	https://example.com/stream.m3u8	Filmes/Séries	Space.br	1315	2026-06-11 19:56:16.823739+00
b5b5b63a-05fb-40b7-800f-b310e4307d8e	CINEMAX FHD²	https://googleplusimages.com/CINEMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Cinemax.br	1316	2026-06-11 19:56:16.823739+00
2761cf26-9369-41ff-8827-2570a9f88894	WARNER CHANNEL FHD²	https://googleplusimages.com/WARNERCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Warner.br	1317	2026-06-11 19:56:16.823739+00
9ca3578b-e698-41b4-a5fb-6914afdbce33	UNIVERSAL TV FHD+	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	1318	2026-06-11 19:56:16.823739+00
7faac0ef-77c2-4c18-a8fc-e13ff523186f	AXN FHD²	https://googleplusimages.com/AXN.png	https://example.com/stream.m3u8	Filmes/Séries	Axn.br	1319	2026-06-11 19:56:16.823739+00
3d300b27-bc54-41f5-b33f-3e2bc09b94dc	SONY CHANNEL FHD²	https://googleplusimages.com/SONYCHANNEL.png	https://example.com/stream.m3u8	Filmes/Séries	Sony.br	1320	2026-06-11 19:56:16.823739+00
f4fe7771-1b07-4e91-a7ff-9437107caf2a	MEGAPIX FHD²	https://googleplusimages.com/MEGAPIX.png	https://example.com/stream.m3u8	Filmes/Séries	Megapix.br	1321	2026-06-11 19:56:16.823739+00
08ae9028-3872-4cc7-90f9-d09120a6d6d3	AMC FHD²	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	1322	2026-06-11 19:56:16.823739+00
fe0200de-04cb-494c-b03c-fa323d7260bc	A&E FHD²	https://googleplusimages.com/A&E.png	https://example.com/stream.m3u8	Filmes/Séries	Ae.br	1323	2026-06-11 19:56:16.823739+00
ee05b3cd-05fd-4a8c-8985-e1599893e6de	LIFETIME FHD²	https://googleplusimages.com/LIFETIME.png	https://example.com/stream.m3u8	Variedades/Música	Lifetime.br	1324	2026-06-11 19:56:16.823739+00
7c100f6f-c1ac-410a-9a72-a74f463a2782	STUDIO UNIVERSAL FHD¹	https://googleplusimages.com/STUDIOUNIVERSAL.png	https://example.com/stream.m3u8	Filmes/Séries	Studiouniversal.br	1325	2026-06-11 19:56:16.823739+00
f5aceb76-baf2-4032-b723-ac43920557d0	CANAL BRASIL FHD²	https://googleplusimages.com/CANALBRASIL.png	https://example.com/stream.m3u8	Geral	Canalbrasil.br	1326	2026-06-11 19:56:16.823739+00
7b6bc0c5-87d7-4172-b638-4801d1df25e8	FILM&ARTS FHD²	https://googleplusimages.com/FILM&ARTS.png	https://example.com/stream.m3u8	Geral	Filmarts.br	1327	2026-06-11 19:56:16.823739+00
2b1252d9-8737-47db-8c06-52a881ddf7b0	TV GAZETA VITÓRIA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1328	2026-06-11 19:56:16.823739+00
d7813955-f357-43ba-b2ff-6fd228263c6b	RBS TV PORTO ALEGRE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1329	2026-06-11 19:56:16.823739+00
7e534560-6a60-4e30-a421-c7d265285c55	RPC CURITIBA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1330	2026-06-11 19:56:16.823739+00
f120abe6-9aad-4dbd-a88e-f9b094538efc	RPC CURITIBA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1331	2026-06-11 19:56:16.823739+00
e3b48323-4201-4ae1-93c3-f74cf53f6c51	TV MORENA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1332	2026-06-11 19:56:16.823739+00
42ac465a-7134-4437-848d-8c93c4331503	TV CENTRO AMÉRICA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1333	2026-06-11 19:56:16.823739+00
009a43cd-765c-4843-9acd-a2b5cad92348	TV BAHIA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1334	2026-06-11 19:56:16.823739+00
96d34a96-9b13-401f-9c4a-f41eae0eb18f	TV SERGIPE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globose.br	1335	2026-06-11 19:56:16.823739+00
82d35f17-36ad-45db-9383-19c4448061e8	TV ASA BRANCA AL FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoal.br	1336	2026-06-11 19:56:16.823739+00
96d011b2-f130-4025-b084-e3afae755166	TV CABO BRANCO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	1337	2026-06-11 19:56:16.823739+00
ada6d30e-2050-4ef2-b23e-9904a7de0d11	INTERTV CABUGI SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	1338	2026-06-11 19:56:16.823739+00
d717bd6f-051e-4e93-936b-a7a634a439a9	TV BAHIA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1339	2026-06-11 19:56:16.823739+00
24b00d13-90f8-43bb-92f2-9b4fe0505024	INTERTV CABUGI FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrn.br	1340	2026-06-11 19:56:16.823739+00
16e3b2e0-9030-4d13-9bd5-22c70e15feab	TV VERDES MARES SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoce.br	1341	2026-06-11 19:56:16.823739+00
acb90e38-e51d-4c7b-ab86-ba988a7d9054	TV CLUBE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopi.br	1342	2026-06-11 19:56:16.823739+00
716c71b6-ae65-439d-b7ee-d676de030414	TV MIRANTE SÃO LUÍS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1343	2026-06-11 19:56:16.823739+00
c65c6806-8f8d-4f31-b2e0-2211af500325	TV MIRANTE SÃO LUÍS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1344	2026-06-11 19:56:16.823739+00
294d107d-14cc-40e8-b0d7-9f0a7cd79078	TV LIBERAL BELÉM SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1345	2026-06-11 19:56:16.823739+00
585844eb-c49f-44ab-81e6-92408fb7158b	REDE AMAZÔNICA MACAPÁ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoap.br	1346	2026-06-11 19:56:16.823739+00
baf59a63-c95d-49f8-8ee0-4874f41c85e4	REDE AMAZÔNICA MANAUS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1347	2026-06-11 19:56:16.823739+00
2cf58ea4-0d25-4442-9528-4ba3577069b1	REDE AMAZÔNICA MANAUS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoam.br	1348	2026-06-11 19:56:16.823739+00
4dc79a2d-611b-49f7-bc21-7295aed6b0b1	REDE AMAZÔNICA BOA VISTA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globorr.br	1349	2026-06-11 19:56:16.823739+00
c7f8aec0-6669-48fc-880e-67473b93b217	REDE AMAZÔNICA PORTO VELHO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoro.br	1350	2026-06-11 19:56:16.823739+00
bd43ff6b-5895-435d-9dda-2188aefd6aec	COMBATE FHD²	https://googleplusimages.com/COMBATE.png	https://example.com/stream.m3u8	Esportes	Combate.br	1351	2026-06-11 19:56:16.823739+00
ba034d8d-9e0d-427f-8e64-0e2d5cb765e2	[CA] FIGHT NETWORK HD²	https://i.ibb.co/p02J0f7/FIGHTNETWORK.png	https://example.com/stream.m3u8	Geral	FightNetwork.pt	1352	2026-06-11 19:56:16.823739+00
bd7c8871-7465-4a36-83ce-8b3925fbe4b6	TV NOVO TEMPO HD²	https://googleplusimages.com/TVNOVOTEMPO.png	https://example.com/stream.m3u8	Geral	Tvnovotempo.br	1353	2026-06-11 19:56:16.823739+00
a8f9a7f5-8029-49e3-b057-ff3d20fce2da	(+18) SEXTREME HD²	https://googleplusimages.com/SEXTREME.png	https://example.com/stream.m3u8	Adulto	Sextreme.br	1354	2026-06-11 19:56:16.823739+00
f06f929e-aa8c-4984-9552-cb12dd21f014	SBT SP FHD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	1355	2026-06-11 19:56:16.823739+00
c7c84e3f-e549-4afd-ab67-513c17760fc9	SBT BRASILIA FHD²	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtdf.br	1356	2026-06-11 19:56:16.823739+00
cbec8ea8-bae7-49ee-9765-811a52e89c75	TV JANGADEIRO HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtce.br	1357	2026-06-11 19:56:16.823739+00
3a1e87b2-b648-49ab-98ce-0e8535a5eb05	SBT RIO FHD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtrj.br	1358	2026-06-11 19:56:16.823739+00
d7ea8622-5070-4ac7-82c6-c092f56b93ce	SBT RP HD¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtrp.br	1359	2026-06-11 19:56:16.823739+00
886a4b00-93a7-4cd7-83d3-ebd976266fea	DPA FAST | INFANTIL+	https://googleplusimages.com/DPAFAST.png	https://example.com/stream.m3u8	Geral	dpa-fast	1360	2026-06-11 19:56:16.823739+00
1318840d-7c11-4e5f-af01-aa0230143211	MALHACAO FAST | NOVELAS+	https://googleplusimages.com/MALHACAOFAST.png	https://example.com/stream.m3u8	Geral	malhacao-fast	1361	2026-06-11 19:56:16.823739+00
9f0dec33-61ab-495e-9552-5e7a566ea577	SBT CENTRAL HD²	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtcentral.br	1362	2026-06-11 19:56:16.823739+00
ece4aa90-e863-4c08-83dd-8a9f99983ad5	SCC SBT  HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtsc.br	1363	2026-06-11 19:56:16.823739+00
f1fa0c84-f325-4a13-90e6-351e80666fd8	EPTV CAMPINAS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1364	2026-06-11 19:56:16.823739+00
4262004b-d2ee-46a8-b902-97b3b0b0b442	INTERTV SERRA+MAR FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvrj.br	1365	2026-06-11 19:56:16.823739+00
a5a1ade9-cc13-4084-b67c-3131db95810a	TV RIO SUL FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvriosul.br	1366	2026-06-11 19:56:16.823739+00
427adfc6-9138-4c4e-8673-e911ce1ab222	TV DIÁRIO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvdiariosp.br	1367	2026-06-11 19:56:16.823739+00
b58397ba-feba-4efc-8cbe-546d6194272c	EPTV CENTRAL SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1368	2026-06-11 19:56:16.823739+00
57c82806-5980-4682-9272-cb64ee9645fc	EPTV RIBEIRÃO H265²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvsp.br	1369	2026-06-11 19:56:16.823739+00
39b84e41-3608-4108-9e12-e80be501cad7	MUQUIRANAS | 24H+	https://googleplusimages.com/MUQUIRANAS.png	https://example.com/stream.m3u8	Geral	Muquiranas.24h	1370	2026-06-11 19:56:16.823739+00
a399707f-2cc9-484d-bf59-2d4f22a49397	BOB ESPONJA | 24H+	https://googleplusimages.com/BOBESPONJA.png	https://example.com/stream.m3u8	Geral	Bobesponja.24h	1371	2026-06-11 19:56:16.823739+00
da32ac96-effb-4169-bdfb-91e95988d04e	RECORD GUAÍBA RS SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrs.br	1372	2026-06-11 19:56:16.823739+00
f269cf1a-5b60-457f-97ac-5a987bba725d	RECORD RIO FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrj.br	1373	2026-06-11 19:56:16.823739+00
f275d07d-c1cc-4c72-a208-81d636861e9e	SPORTV 4 FHD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv4.br	1374	2026-06-11 19:56:16.823739+00
cdced7ee-860e-4941-aa69-d8f67f8b0378	SPORTV 4 HD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv4.br	1375	2026-06-11 19:56:16.823739+00
32c84956-67c3-4f8f-8412-e695117463d8	SPORTV 4 HD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv4.br	1376	2026-06-11 19:56:16.823739+00
94e55d54-a5cb-43ee-b986-e068365b19e6	MOSAICO SPORTV HD¹	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportvextra.br	1377	2026-06-11 19:56:16.823739+00
acf5c7bf-7382-4085-831f-ac4e2ffe8bfb	MOSAICO SPORTV HD²	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportvextra.br	1378	2026-06-11 19:56:16.823739+00
5a18ae97-1233-4fe7-b257-b1e8df8d94ee	TV FRONTEIRA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvfronteirasp.br	1379	2026-06-11 19:56:16.823739+00
dc7e9e88-023e-4773-b504-5bc91264394e	TV FRONTEIRA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvfronteirasp.br	1380	2026-06-11 19:56:16.823739+00
27b5cffd-5907-4cbd-bf85-e6c7315074cc	TV TEM SOROCABA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1381	2026-06-11 19:56:16.823739+00
64380d5c-214e-44e0-bbd8-49be72846bab	TV TEM SOROCABA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1382	2026-06-11 19:56:16.823739+00
54a4de75-3333-4ce5-879e-6b108816173a	TV TEM BAURU FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1383	2026-06-11 19:56:16.823739+00
bc3c20be-dc38-40b8-8226-cd54a27194f2	TV TEM BAURU SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1384	2026-06-11 19:56:16.823739+00
153ef6b9-239f-4776-b3ca-2647653ccf6c	TV TEM ITAPETININGA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1385	2026-06-11 19:56:16.823739+00
f2ae2e92-d90a-43ab-af26-14b18c7726ef	TV TEM ITAPETININGA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1386	2026-06-11 19:56:16.823739+00
516eccbb-e159-4dc7-b8a4-79ecb109f224	TV TEM ITAPETININGA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1387	2026-06-11 19:56:16.823739+00
5115b397-0afd-4bf7-9d33-6a01be1dde86	TV TEM S. J. DO RIO PRETO SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtem.br	1388	2026-06-11 19:56:16.823739+00
b9971b3b-38ae-495c-b75d-7298ed81d4d8	TV TRIBUNA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtribunasp.br	1389	2026-06-11 19:56:16.823739+00
08231958-a2ed-450f-a9e2-0224b916e766	TV TRIBUNA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtribunasp.br	1390	2026-06-11 19:56:16.823739+00
259aa8eb-782f-4e24-9b13-447e1a914b08	TV VANGUARDA S. J. DOS CAMPOS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	1391	2026-06-11 19:56:16.823739+00
f9504539-fb3b-4f2f-b9fe-cf7ad6d1d46e	TV VANGUARDA S. J. DOS CAMPOS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	1392	2026-06-11 19:56:16.823739+00
e842dc92-230b-4529-8da7-eb9714639038	TV VANGUARDA TAUBATÉ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvvanguarda.br	1393	2026-06-11 19:56:16.823739+00
f77a6ee8-c05c-49db-9706-f8b412827f70	TV INTEGRAÇÃO ARAXÁ FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1394	2026-06-11 19:56:16.823739+00
d8c53fef-c6e0-41c6-ad74-23549748402f	TV INTEGRAÇÃO JUIZ DE FORA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1395	2026-06-11 19:56:16.823739+00
c9695838-f118-4701-99da-10b3429f298a	TV INTEGRAÇÃO JUIZ DE FORA SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1396	2026-06-11 19:56:16.823739+00
8669b494-b9d1-4942-a216-c63ad02e702d	TV INTEGRAÇÃO UBERABA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvintegracao.br	1397	2026-06-11 19:56:16.823739+00
51e872a4-5064-4c3c-9616-db113ff43cd2	EPTV SUL DE MINAS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvmg.br	1398	2026-06-11 19:56:16.823739+00
6646cb4e-7693-43e2-96c9-bdf78638cc12	EPTV SUL DE MINAS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Eptvmg.br	1399	2026-06-11 19:56:16.823739+00
a0111e07-ed41-4e32-af71-64b7a242b7ac	INTERTV DOS VALES FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	1400	2026-06-11 19:56:16.823739+00
27a01e43-7e55-4f4f-baf5-18d4923fdb4a	INTERTV GRANDE MINAS SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	1401	2026-06-11 19:56:16.914968+00
401f0daf-111f-4522-a8d3-fa064a86845e	TV GAZETA NORTE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1402	2026-06-11 19:56:16.914968+00
acfd053c-2298-4e6a-971e-5848efd58e38	TV GAZETA NOROESTE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globoes.br	1403	2026-06-11 19:56:16.914968+00
ddda6fc5-c85f-4a4d-9ac3-3fadae6db0c9	RBS TV BAGÉ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1404	2026-06-11 19:56:16.914968+00
d56c2c84-0455-470f-9985-8832c4579eae	RBS TV CAXIAS DO SUL FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1405	2026-06-11 19:56:16.914968+00
f4b2d040-1670-40c0-af73-1ad70c6c87aa	RBS TV ERECHIM HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1406	2026-06-11 19:56:16.914968+00
4a0a4d5c-43ee-49b2-9612-ee8e4ed6fa2d	RBS TV CRUZ ALTA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1407	2026-06-11 19:56:16.914968+00
1b8204a3-c2b0-4955-93bc-4d72ce8ddcb6	RBS TV DOS VALES HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1408	2026-06-11 19:56:16.914968+00
053bdf4b-9b4e-45e6-8eb0-f977d4fa8cf0	RBS TV PASSO FUNDO FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1409	2026-06-11 19:56:16.914968+00
f6a6316b-dc05-41c3-88b7-767112691e59	RBS TV PELOTAS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1410	2026-06-11 19:56:16.914968+00
af19387c-0d6b-492c-8ef1-d2a72396de93	RBS TV RIO GRANDE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1411	2026-06-11 19:56:16.914968+00
3411cd00-1fb7-47ad-9e7b-4078fade31a3	RBS TV SANTA ROSA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1412	2026-06-11 19:56:16.914968+00
ea04ec67-0178-46e8-9c9c-81bf218f4940	RBS TV URUGUAIANA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1413	2026-06-11 19:56:16.914968+00
c94093fe-5129-445b-90ee-3fca5005763e	NSC TV BLUMENAU FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1414	2026-06-11 19:56:16.914968+00
bc7da065-b3ae-4c35-807a-a8181c4dc9e2	NSC TV BLUMENAU SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1415	2026-06-11 19:56:16.914968+00
544b1b55-7cc1-44be-bc11-c188af798cf0	NSC TV CHAPECÓ FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1416	2026-06-11 19:56:16.914968+00
f26a17d1-ac59-4cd4-aa4e-7df41c03ce83	NSC TV JOINVILLE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globosc.br	1417	2026-06-11 19:56:16.914968+00
567c5c83-d7a8-4136-86a4-89c7f614363d	RPC CASCAVEL SD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1418	2026-06-11 19:56:16.914968+00
5438fe9a-1130-4e8c-b126-3d86521d2a72	RPC CASCAVEL FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1419	2026-06-11 19:56:16.914968+00
e2516e7b-bb36-48fe-93fa-eda3c32e9580	RPC FOZ DO IGUAÇU FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1420	2026-06-11 19:56:16.914968+00
58900331-f821-4117-a77b-0847ae1face9	RPC PARANAVAÍ FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1421	2026-06-11 19:56:16.914968+00
e7e46e42-d366-49d8-8ed5-80708514243e	RPC PARANAVAÍ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1422	2026-06-11 19:56:16.914968+00
d44dd043-eb77-4b90-8c96-4ed564736009	TV MORENA CORUMBÁ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1423	2026-06-11 19:56:16.914968+00
abf9eb9d-0ca0-4f58-a1a7-fa978f0c7f72	TV MORENA PONTA PORÃ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoms.br	1424	2026-06-11 19:56:16.914968+00
5cf54634-1edd-4f11-9d8c-86d1e3e23c65	TV CENTRO AMÉRICA SUL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1425	2026-06-11 19:56:16.914968+00
22131490-d1b6-4301-b260-10aea0e844f7	TV CENTRO AMÉRICA NORTE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1426	2026-06-11 19:56:16.914968+00
9a3cf22a-5e9d-44b2-930d-357dbe2654c2	TV CENTRO AMÉRICA TANGARÁ DA SERRA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globomt.br	1427	2026-06-11 19:56:16.914968+00
b7a8978c-f02e-4736-ac45-f1de1848fc9e	TV ANHANGUERA ANÁPOLIS FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1428	2026-06-11 19:56:16.914968+00
b8550b09-b777-46db-b291-5b8397ebd2c8	TV ANHANGUERA ANÁPOLIS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1429	2026-06-11 19:56:16.914968+00
edfe9e76-c71c-4a91-a144-501b3de58bc8	TV ANHANGUERA CATALÃO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1430	2026-06-11 19:56:16.914968+00
40ecb175-5d3c-4876-ac04-6856d72c1e09	TV ANHANGUERA CATALÃO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1431	2026-06-11 19:56:16.914968+00
d686d0be-abfb-4b59-905c-a1d46eb00910	TV ANHANGUERA ITUMBIARA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1432	2026-06-11 19:56:16.914968+00
1a5a1e2a-7069-4a33-9bd4-51b9040648f0	TV ANHANGUERA ITUMBIARA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1433	2026-06-11 19:56:16.914968+00
e2d91f82-e45e-452e-9327-cdd5fb490c98	TV ANHANGUERA JATAÍ FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1434	2026-06-11 19:56:16.914968+00
605ea2d4-8213-4037-8414-9fe2b0b2cc9c	TV ANHANGUERA JATAÍ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1435	2026-06-11 19:56:16.914968+00
69688294-0c3c-4511-983f-d4c20b7b05e7	TV ANHANGUERA LUZIÂNIA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1436	2026-06-11 19:56:16.914968+00
f8eb7ed0-633f-4e40-a432-f44797e3dbd6	TV ANHANGUERA LUZIÂNIA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1437	2026-06-11 19:56:16.914968+00
28e0994c-8b70-457f-bbb1-94d2c9df8d37	TV ANHANGUERA RIO VERDE HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1438	2026-06-11 19:56:16.914968+00
39cdcc7d-0ba5-4edc-bfd1-6f1569ea69d3	TV ANHANGUERA RIO VERDE FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globogo.br	1439	2026-06-11 19:56:16.914968+00
b798ddac-88e0-4db2-b3a2-0b7f575cacf4	TV LIBERAL ALTAMIRA HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1440	2026-06-11 19:56:16.914968+00
d8202b4a-3f24-41fe-aa9a-f7e65c164d52	TV LIBERAL CASTANHAL HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1441	2026-06-11 19:56:16.914968+00
e16486bf-732e-403c-8e5c-14e544f6c93c	TV LIBERAL MARABÁ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1442	2026-06-11 19:56:16.914968+00
90e922b8-4e59-4592-bce6-88b710fd447e	TV LIBERAL PARAUAPEBAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1443	2026-06-11 19:56:16.914968+00
1e1eb34b-68bb-4f75-9889-550370a4cdb1	TV LIBERAL PARAGOMINAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1444	2026-06-11 19:56:16.914968+00
d894acb3-5ca0-43af-aa98-f6ba6d956b50	TV LIBERAL REDENÇÃO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopa.br	1445	2026-06-11 19:56:16.914968+00
c6a67cb1-50f9-48ca-aa1b-ba44b4dd42b7	TV TAPAJÓS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Tvtapajos.br	1446	2026-06-11 19:56:16.914968+00
b391f57b-5f2e-42e2-8b1e-20152aae8b78	TV SUBAÉ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1447	2026-06-11 19:56:16.914968+00
947e1740-8ec8-4f03-b757-4791294b65ca	TV SÃO FRANCISCO FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1448	2026-06-11 19:56:16.914968+00
2e37bbd9-f7d6-4507-8e60-efc5c38f75c6	TV SÃO FRANCISCO HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoba.br	1449	2026-06-11 19:56:16.914968+00
9a793e79-8746-43cd-9428-b5d6e12eb353	TV ASA BRANCA FHD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Asabranca.br	1450	2026-06-11 19:56:16.914968+00
da69c258-1cdc-499c-86c6-7bda923bd371	TV MIRANTE IMPERATRIZ HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1451	2026-06-11 19:56:16.914968+00
9d15ade0-38a1-43ce-83e5-0b5dc61cdd2d	TV MIRANTE BALSAS HD²	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globoma.br	1452	2026-06-11 19:56:16.914968+00
4eb751ac-6d4d-45cd-93b7-a56c9bb28b59	TV CONQUISTA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordmt.br	1453	2026-06-11 19:56:16.914968+00
058e5ce0-9ea7-420f-ac35-d4855bd7f7b8	RECORD BAHIA FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordba.br	1454	2026-06-11 19:56:16.914968+00
9c727973-ee6d-4c82-af01-b74039b40950	RECORD MINAS FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordmg.br	1455	2026-06-11 19:56:16.914968+00
7b60d440-26a5-4885-b273-f6153bbc476f	RECORD INTERIOR SP FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordintsp.br	1456	2026-06-11 19:56:16.914968+00
ba6fc3d0-d18e-4103-b2d5-a3a410923a57	RECORD INTERIOR SP HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordintsp.br	1457	2026-06-11 19:56:16.914968+00
ca1ae86f-7f03-48a6-88ca-a0cdadcab3c7	RECORD RIO PRETO FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordriopreto.br	1458	2026-06-11 19:56:16.914968+00
b48cbd23-f2cf-41a0-8dfb-0274d6ebb614	RECORD RIO PRETO HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordriopreto.br	1459	2026-06-11 19:56:16.914968+00
66544c86-8344-4164-99cb-53e30a4a749e	RECORD LITORAL E VALE FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordlitoralvale.br	1460	2026-06-11 19:56:16.914968+00
2fc4335c-a0f0-4a9b-8203-2b2097b9307a	RECORD LITORAL E VALE HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordlitoralvale.br	1461	2026-06-11 19:56:16.914968+00
332c772c-06c4-4451-bf2a-da5bc60734e8	RECORD INTERIOR RJ HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordintrj.br	1462	2026-06-11 19:56:16.914968+00
ef7af425-d9b0-4e64-a12f-adc5619de738	RECORD GOIÁS SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordgo.br	1463	2026-06-11 19:56:16.914968+00
ed5f98a5-5c27-41ba-96aa-6f20362de092	RECORD GOIÁS H265²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordgo.br	1464	2026-06-11 19:56:16.914968+00
10d0b996-7961-4da0-bf59-e06bc852800b	RECORD GUAÍBA RS FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordrs.br	1465	2026-06-11 19:56:16.914968+00
af22e6ef-ee62-42bc-ada5-b214905f9bcf	RECORD MANAUS SD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	1466	2026-06-11 19:56:16.914968+00
391f0292-fe41-4eac-b76c-c79d3d03bac8	TV CIDADE SÃO LUÍS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordma.br	1467	2026-06-11 19:56:16.914968+00
0668102f-b04e-4e1f-b96a-2c63de84b80f	TV PARANAÍBA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordparanaiba.br	1468	2026-06-11 19:56:16.914968+00
29a3a977-3fdd-44b1-8c0d-5f504ae8a251	TV CORREIO HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpb.br	1469	2026-06-11 19:56:16.914968+00
504d7cf1-46c4-4091-a4b5-9d9a107d588f	RICTV CURITIBA FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpr.br	1470	2026-06-11 19:56:16.914968+00
ab2c6b9d-143e-49ce-bfa5-42ae9f8727e0	RICTV CURITIBA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpr.br	1471	2026-06-11 19:56:16.914968+00
0af47d01-feeb-4c7b-be73-782c22c9eed3	TV ANTENA 10 HD¹ (PROGRAMAÇÃO LOCAL)	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordpi.br	1472	2026-06-11 19:56:16.914968+00
7bee9e11-2640-4ef0-a063-cc152e65a8d0	SIC TV HD°	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordro.br	1473	2026-06-11 19:56:16.914968+00
113d5304-6a93-4642-9dc5-e57f6148c08e	TV VILA REAL HD°	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordmt.br	1474	2026-06-11 19:56:16.914968+00
c0c07a29-5794-422f-8769-9352b3b1374c	NDTV FLORIANÓPOLIS FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordsc.br	1475	2026-06-11 19:56:16.914968+00
505ca885-47d8-49a6-918a-823c53114ae6	NDTV FLORIANÓPOLIS HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordsc.br	1476	2026-06-11 19:56:16.914968+00
abb5e118-9274-47c9-b8ba-9cd11ba9cb02	TV ATALAIA HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordse.br	1477	2026-06-11 19:56:16.914968+00
77726733-5b2c-49a5-bfe7-852ba9c2e2e5	TV ATALAIA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordse.br	1478	2026-06-11 19:56:16.914968+00
01b9482f-54dd-4245-95eb-d1170ef4c1c3	TH+ RECORD CAMPINAS FHD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Threcordcampinas.br	1479	2026-06-11 19:56:16.914968+00
966f508a-920c-47e6-be22-958ac6be4da4	EUROCHANNEL HD²	https://googleplusimages.com/EUROCHANNEL.png	https://example.com/stream.m3u8	Geral	Eurochannel.br	1480	2026-06-11 19:56:16.914968+00
0416df45-c0a5-45e4-8ed0-b56e00491bf0	SBT KIDS HD¹	https://googleplusimages.com/MAISSBT.png	https://example.com/stream.m3u8	Abertos	Sbtkids.br	1481	2026-06-11 19:56:16.914968+00
2c3e6c46-6729-4615-b75e-7d73407df275	+SBT RAIZ	https://googleplusimages.com/MAISSBT.png	https://example.com/stream.m3u8	Abertos	Sbtraiz.br	1482	2026-06-11 19:56:16.914968+00
08a72398-4032-4c94-ba55-166ab70eabff	+SBT NOVELAS HD¹	https://googleplusimages.com/MAISSBT.png	https://example.com/stream.m3u8	Abertos	Sbtnovelas.br	1483	2026-06-11 19:56:16.914968+00
41943931-23d6-47ad-b2ea-3b7ee7436078	LANCE 1 HD¹	https://googleplusimages.com/LANCE.png	https://example.com/stream.m3u8	Geral	Ausente.br	1484	2026-06-11 19:56:16.914968+00
f7614fa7-3cda-4d93-9ef1-9cc01defbf8a	TV MAANAIM HDº	https://play-lh.googleusercontent.com/4VU7QYnTKx8cznp9IZwh92PODnC3PgrEmKEla3lO0rHmnCshuxSf6h2MFrHo_qGXqH4=s200	https://example.com/stream.m3u8	Geral	Ausente.br	1485	2026-06-11 19:56:16.914968+00
4cebd851-f958-4265-b77e-3181fc670171	BLUE HUSTLER	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1486	2026-06-11 19:56:16.914968+00
cc6959e7-2c69-4b46-8ad1-b47eb61ed6f0	CENTOXCENTO	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1487	2026-06-11 19:56:16.914968+00
ca5d2bbe-0b65-42ee-a551-94cbbc2da942	PINK-O	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1488	2026-06-11 19:56:16.914968+00
fcb63bac-d21b-4963-8bca-c1e9e88ea809	CANDY	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1489	2026-06-11 19:56:16.914968+00
1711956b-2ce1-4a7a-93ab-c949f1122f87	BABANDO DE TESAO	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Abertos	Adultos.br	1490	2026-06-11 19:56:16.914968+00
c189742b-7b08-4d5c-9cb8-5aabedc41659	PRIVATE	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1491	2026-06-11 19:56:16.914968+00
ac2d6928-a5e1-45b1-8d84-3bc8894ad445	REDLIGHT	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1492	2026-06-11 19:56:16.914968+00
63b9fca7-e12d-43f5-8299-dc1f3c5d480e	SEXT6SENSO	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1493	2026-06-11 19:56:16.914968+00
0e5b6dd0-e4c7-4073-b6bb-6aeb05350c9c	PENTHOUSE QUICKIES	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1494	2026-06-11 19:56:16.914968+00
1a0d4af9-d2b1-47bd-8edd-2d27d0117ff8	AGORA E HORA DAS PODEROSAS	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1495	2026-06-11 19:56:16.914968+00
e9efad20-f22e-43c0-a320-fbada5f271fc	BRASILEIRINHAS: BIG MACK	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1496	2026-06-11 19:56:16.914968+00
bdc6efba-c77a-468f-80e1-8ede23997e1b	PASSION	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1497	2026-06-11 19:56:16.914968+00
2ebaa316-8a92-4b41-9525-6e1558701b11	FAZENDO SACANAGEM	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1498	2026-06-11 19:56:16.914968+00
047e33b5-c5c2-4ae3-b8db-a27f2dd8b933	SCT	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1499	2026-06-11 19:56:16.914968+00
0dfdf9e8-d079-4e5b-8692-77d43ac1ff67	ASSIM VC ME MATA	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1500	2026-06-11 19:56:16.914968+00
bd4a075a-aa18-40fa-b297-c6a6257cc7ed	BRAZZERS EUROPE	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1501	2026-06-11 19:56:16.914968+00
c9d245e3-0941-4293-bfb9-ca4aef719b75	ADULTO 16	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1502	2026-06-11 19:56:16.914968+00
66ce4d5a-340c-4668-bbde-994a56f1a38f	ADULTO 17	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1503	2026-06-11 19:56:16.914968+00
443c7a05-d565-4526-b2ec-fdcf5c0dfa08	ADULTO 18	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1504	2026-06-11 19:56:16.914968+00
b3d1f4f5-d58f-4503-bd32-37decde0ba2a	ADULTO 19	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1505	2026-06-11 19:56:16.914968+00
7ec763e0-42af-4904-828f-e8efc45c06f4	ADULTO 20	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Geral	Adultos.br	1506	2026-06-11 19:56:16.914968+00
5a0b73d5-ba1a-4117-88f2-220498f0c0be	TIMES BRASIL HD¹	https://googleplusimages.com/TIMESBRASIL.png	https://example.com/stream.m3u8	Geral	Timescnbc.br	1507	2026-06-11 19:56:16.914968+00
13188776-fcab-4df7-9f47-25469903bb5c	RUNTIME ACAO | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimeacao.br	1508	2026-06-11 19:56:16.914968+00
195c6e91-bef8-423e-8711-de68025c2675	RUNTIME FAMILIA | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimefamilia.br	1509	2026-06-11 19:56:16.914968+00
d198b7f7-a35a-4691-b62b-4ea929e14674	RUNTIME CINESPANTO | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimecinespanto.br	1510	2026-06-11 19:56:16.914968+00
65a3e150-e6d9-4f8d-a286-2da7ba6f9771	RUNTIME | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtime.br	1511	2026-06-11 19:56:16.914968+00
8857d7cc-9c1a-4e16-aaa0-97bc64d520d4	RUNTIME CRIME | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimecrime.br	1512	2026-06-11 19:56:16.914968+00
2b460120-d96d-4a26-a4a5-15e5cabb6039	RUNTIME COMEDIA | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimecomedia.br	1513	2026-06-11 19:56:16.914968+00
2c82f47d-858a-43bc-a4b3-279032dab35d	RUNTIME ROMANCE | FILMES+	https://googleplusimages.com/RUNTIME.png	https://example.com/stream.m3u8	Geral	Runtimeromance.br	1514	2026-06-11 19:56:16.914968+00
b985aa3b-879f-456c-babc-b600a182a9a4	MOVIESPHERE | FILMES+	https://googleplusimages.com/MOVIESPHERE.png	https://example.com/stream.m3u8	Geral	Moviesphere.br	1515	2026-06-11 19:56:16.914968+00
80aff983-13e3-458b-8481-21727e9e1969	MOTORVISION TV | ESPORTES+	https://googleplusimages.com/MOTORVISION.png	https://example.com/stream.m3u8	Geral	Motorvision.br	1516	2026-06-11 19:56:16.914968+00
6d664337-c319-47b4-af65-0c713f9ad580	DISNEY+ 6 HD¹	https://googleplusimages.com/DISNEYPLUS.png	https://example.com/stream.m3u8	Infantil	Disneyplus.br	1517	2026-06-11 19:56:16.914968+00
ba839bef-66a4-4dce-a422-50bd6ddf617c	JP NEWS SD¹	http://googleplusimages.com/JPNEWS.png	https://example.com/stream.m3u8	Geral	Jpnews.br	1518	2026-06-11 19:56:16.914968+00
26b7e37a-3769-4c2b-abbb-e0ed5c347ba0	TV TAROBÁ CASCAVEL HD²	http://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Tvtaroba.br	1519	2026-06-11 19:56:16.914968+00
a4f52b5b-8af0-4bde-9527-9dd5d4adefbf	CANAL UOL FHD¹	https://googleplusimages.com/CANALUOL.png	https://example.com/stream.m3u8	Geral	Canaluol.br	1520	2026-06-11 19:56:16.914968+00
a30d3706-4c7e-49c4-9d3e-634aba8a8933	TV ALTEROSA HD²	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtmg.br	1521	2026-06-11 19:56:16.914968+00
830a7063-f5f3-4cc3-91f5-ca0794b47556	TV PAJUÇARA HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordal.br	1522	2026-06-11 19:56:16.914968+00
c6ea674a-3eba-4865-9b73-992972d806cc	TV PONTA VERDE HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtal.br	1523	2026-06-11 19:56:16.914968+00
7eab3748-f4e8-417c-a352-9ddaa3d03142	TV ARAPUAN HD¹	http://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandpb.br	1524	2026-06-11 19:56:16.914968+00
7f84fe74-6856-4a5b-a480-1e04109f2347	SPORTV FHD+	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv.br	1525	2026-06-11 19:56:16.914968+00
a1691609-9243-413c-a12c-d2205e935036	SPORTV 2 FHD+	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv2.br	1526	2026-06-11 19:56:16.914968+00
701eb3a0-64b9-4426-acf9-162d28a51042	SPORTV 3 FHD+	https://googleplusimages.com/SPORTV.png	https://example.com/stream.m3u8	Esportes	Sportv3.br	1527	2026-06-11 19:56:16.914968+00
27c03dab-6d22-4aa2-92a7-49b7de6b0319	CAZETV 1 HD¹	https://googleplusimages.com/CAZETV.png	https://example.com/stream.m3u8	Geral	Cazetv.br	1528	2026-06-11 19:56:16.914968+00
be9f4e79-b1a7-4e9b-803f-5c61596a5c10	PREMIERE CLUBES FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiereclubes.br	1529	2026-06-11 19:56:16.914968+00
da858e4a-1a82-4df3-a6e1-3c5e913fdd92	PREMIERE 2 FHD⁺	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere2.br	1530	2026-06-11 19:56:16.914968+00
a014c517-5ea9-48c8-92c9-b67b8e112840	PREMIERE 3 FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere3.br	1531	2026-06-11 19:56:16.914968+00
c747b127-52ca-4f10-900f-3194a0a5a73e	PREMIERE 4 FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere4.br	1532	2026-06-11 19:56:16.914968+00
87c5e5a7-a0b2-4d01-bfe3-3dd972a4ce90	PREMIERE 5 FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere5.br	1533	2026-06-11 19:56:16.914968+00
2db713c5-2af1-486b-9e5b-38ebc466249a	PREMIERE 6 FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere6.br	1534	2026-06-11 19:56:16.914968+00
9723f850-54da-48b7-892e-8e0a457c23b2	PREMIERE 7 FHD+	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere7.br	1535	2026-06-11 19:56:16.914968+00
d06db62a-ec44-4c9b-9f03-fdaa1203b629	PREMIERE 8 - MOSAICO FHD⁺	https://googleplusimages.com/PREMIERE.png	https://example.com/stream.m3u8	Esportes	Premiere8.br	1536	2026-06-11 19:56:16.914968+00
9d00ba6e-79c5-48a1-87e4-e8930c1c1fb5	TERRA VIVA HD¹	https://googleplusimages.com/TERRAVIVA.png	https://example.com/stream.m3u8	Variedades/Música	Terraviva.br	1537	2026-06-11 19:56:16.914968+00
51dff487-af34-4e7e-9c05-58a7a86fdfd3	CANAL UOL HD²	https://googleplusimages.com/CANALUOL.png	https://example.com/stream.m3u8	Geral	Canaluol.br	1538	2026-06-11 19:56:16.914968+00
8eb6e457-c0f7-4e76-aa45-7f1c0e25a94d	LMC+ HD²	https://googleplusimages.com/LMCPLUS.png	https://example.com/stream.m3u8	Geral	Lmcplus.br	1539	2026-06-11 19:56:16.914968+00
bf900dd8-fc3d-4083-8915-7be9251f7e37	BOA VONTADE TV+	https://googleplusimages.com/BOAVONTADE.png	https://example.com/stream.m3u8	Geral	Boavontadetv.br	1540	2026-06-11 19:56:16.914968+00
e3d63570-1997-44f9-9457-e47a900467e7	ESPN HD+	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn.br	1541	2026-06-11 19:56:16.914968+00
1c45c886-f4d2-4de6-b719-f89cdb398ee7	ESPN2 HD⁺	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn2.br	1542	2026-06-11 19:56:16.914968+00
d6a71ee5-8a8b-4843-9957-9138756b5dd9	ESPN3 HD⁺	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn3.br	1543	2026-06-11 19:56:16.914968+00
197dede8-530e-4ed6-abdd-80a649a3da52	ESPN4 HD+	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn4.br	1544	2026-06-11 19:56:16.914968+00
a8a51448-9c0f-4b31-a07f-44c27a05db02	ESPN5 HD⁺	https://googleplusimages.com/ESPN.png	https://example.com/stream.m3u8	Esportes	Espn5.br	1545	2026-06-11 19:56:16.914968+00
80996024-ed06-48ee-9379-3a1df074d9df	PARAMOUNT+ 1 HD+	https://googleplusimages.com/PARAMOUNTPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Paramountplus1.br	1546	2026-06-11 19:56:16.914968+00
cc3fceac-5000-40cc-bef5-3b190816e64d	PARAMOUNT+ 2 HD+	https://googleplusimages.com/PARAMOUNTPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Paramountplus2.br	1547	2026-06-11 19:56:16.914968+00
78f33978-bf1b-468b-bdbe-4cabc2d7e664	PARAMOUNT+ 3 HD+	https://googleplusimages.com/PARAMOUNTPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Paramountplus3.br	1548	2026-06-11 19:56:16.914968+00
694b233c-5e23-42b9-acc9-cec33abb960a	PARAMOUNT+ 4 HD+	https://googleplusimages.com/PARAMOUNTPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Paramountplus4.br	1549	2026-06-11 19:56:16.914968+00
ced9904e-e73b-4d4d-84dd-b3421d45bbb7	SPORTYNET HD+	http://googleplusimages.com/SPORTYNET.png	https://example.com/stream.m3u8	Geral	Sportynet.br	1550	2026-06-11 19:56:16.914968+00
4840c004-b3e4-4076-90e7-fd8b5b531e40	SPORTYNET+ 1 HD+	http://googleplusimages.com/SPORTYNET.png	https://example.com/stream.m3u8	Geral	Sportynetplus1.br	1551	2026-06-11 19:56:16.914968+00
69c677f2-42ef-4b22-a82f-ab14aca45432	SPORTYNET+ 2 HD+	http://googleplusimages.com/SPORTYNET.png	https://example.com/stream.m3u8	Geral	Sportynetplus2.br	1552	2026-06-11 19:56:16.914968+00
3b45a2b4-8729-4362-84f0-90970b17aa32	SPORTYNET+ 3 HD+	http://googleplusimages.com/SPORTYNET.png	https://example.com/stream.m3u8	Geral	Sportynetplus3.br	1553	2026-06-11 19:56:16.914968+00
41dbc30c-2c96-4697-8e5e-ff02a65edf9b	CNN BRASIL MONEY HD¹	https://googleplusimages.com/CNNMONEY.png	https://example.com/stream.m3u8	Notícias	Cnnmoney.br	1554	2026-06-11 19:56:16.914968+00
3065df3d-60fa-4973-bda8-3b357b15e2d1	TV5 MONDE AMERIQUE LATINE+	https://googleplusimages.com/TV5MONDEAL.png	https://example.com/stream.m3u8	Geral	Tv5monde.br	1555	2026-06-11 19:56:16.914968+00
94bb1d7e-f45d-4a0f-a1a2-a355caa768fc	BAND SP HD+	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandsp.br	1556	2026-06-11 19:56:16.914968+00
44da69e5-ef59-4122-bcd5-9c66d0c57ef8	GRJNGO | FILMES+	https://googleplusimages.com/GRJNGO.png	https://example.com/stream.m3u8	Geral	Grjngo.br	1557	2026-06-11 19:56:16.914968+00
7ddee8c8-eacd-487a-8f43-a2899b84ad4b	FILMRISE SERIES | FILMES+	https://googleplusimages.com/FILMRISE.png	https://example.com/stream.m3u8	Geral	Filmrise.br	1558	2026-06-11 19:56:16.914968+00
63280e86-a15a-48e7-9780-3231047eb069	SPARKTV| FILMES+	https://googleplusimages.com/SPARKTV.png	https://example.com/stream.m3u8	Geral	Sparktv.br	1559	2026-06-11 19:56:16.914968+00
31af8905-62b5-43c6-acff-d4bb60455637	TOON GOGGLES | INFANTIL+	https://googleplusimages.com/TOONGOGGLES.png	https://example.com/stream.m3u8	Geral	Toongoggles.br	1560	2026-06-11 19:56:16.914968+00
39adce41-ffec-4d14-b96c-8ddcf8d7b595	CINDIE LITE | FILMES+	https://googleplusimages.com/CINDIE.png	https://example.com/stream.m3u8	Geral	Cindietv.br	1561	2026-06-11 19:56:16.914968+00
316c2c8d-a7f8-4e11-b34d-956f35608e1c	MYTIME MOVIE NETWORK | FILMES+	https://googleplusimages.com/MYTIMEMOVIENETWORK.png	https://example.com/stream.m3u8	Geral	Mytimemoviesnet.br	1562	2026-06-11 19:56:16.914968+00
c1d70486-4b47-424e-b1f3-34ce85bc0119	CRIME E INVESTIGACAO | FILMES+	https://googleplusimages.com/CRIMEINVESTIGACAO.png	https://example.com/stream.m3u8	Geral	Crimeinvest.br	1563	2026-06-11 19:56:16.914968+00
2d9a195d-df53-4d3c-8d44-0f9afc8ec1cf	SÓ PLAY MOVIES | FILMES+	https://googleplusimages.com/SOPLAY.png	https://example.com/stream.m3u8	Geral	Ausente.br	1564	2026-06-11 19:56:16.914968+00
eb012178-58a1-4a62-8212-70e3720d9344	HBO HD+	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo.br	1565	2026-06-11 19:56:16.914968+00
b062a259-bb5f-4a61-930d-b9b062d07750	HBO FAMILY HD⁺	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbofamily.br	1566	2026-06-11 19:56:16.914968+00
ea47f647-19f3-4582-af7b-5359fe01dfbb	HBO SIGNATURE HD+	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbosignature.br	1567	2026-06-11 19:56:16.914968+00
791aac0c-e910-49f4-99ee-3147db5468be	HBO 2 HD+	https://googleplusimages.com/HBO.png	https://example.com/stream.m3u8	Filmes/Séries	Hbo2.br	1568	2026-06-11 19:56:16.914968+00
85e4775d-1586-4c13-8c10-302cad155ac4	UNIVERSAL PREMIERE HD²	https://googleplusimages.com/UNIVERSALPLUS.png	https://example.com/stream.m3u8	Esportes	Universalpremiere.br	1569	2026-06-11 19:56:16.914968+00
27e11c39-84b4-41e5-95d3-20e94302229c	(+18) VENUS HD¹	https://googleplusimages.com/VENUS.png	https://example.com/stream.m3u8	Adulto	Venus.br	1570	2026-06-11 19:56:16.914968+00
d60bc29e-a000-48b4-b563-41ce22cb4720	REDE MINAS HD¹	http://googleplusimages.com/REDEMINAS.png	https://example.com/stream.m3u8	Geral	Redeminas.br	1571	2026-06-11 19:56:16.914968+00
83a9b060-257f-4c22-9748-d3f72bc59369	BLOOMBERG BRASIL HD¹	https://images.samsung.com/is/image/samsung/assets/br/tvs/smart-tv/channel-list/Bloomberg_TV_1000x1000circle.png?$ORIGIN_PNG$	https://example.com/stream.m3u8	Notícias	Bloomberg.br	1572	2026-06-11 19:56:16.914968+00
da19f90c-95fe-4a84-b448-95ae19238161	FUTURA FHD¹	https://googleplusimages.com/FUTURA.png	https://example.com/stream.m3u8	Geral	Futura.br	1573	2026-06-11 19:56:16.914968+00
0419c03e-4cd1-47ca-9641-ffe449bf7c43	TV VITÓRIA HD+	http://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordes.br	1574	2026-06-11 19:56:16.914968+00
40a9ee8f-2cb4-458e-bf4d-3d47505442e3	TV CIDADE FORTALEZA HD¹	http://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordce.br	1575	2026-06-11 19:56:16.914968+00
a6d4173d-553a-49b5-8827-f5ebdd660f75	DREAMWORKS HD¹	https://i.imgur.com/HKU2TTr.png	https://example.com/stream.m3u8	Geral	Dreamworks.br	1576	2026-06-11 19:56:16.914968+00
8de21ee3-5724-4245-8857-9cbadb011a1e	Channel 2		https://example.com/stream.m3u8	Geral	5fa1612a669ba0000702017b	1577	2026-06-11 19:56:16.914968+00
cb077b41-9a06-495a-addf-e2eb3df6fcea	Channel 3		https://example.com/stream.m3u8	Geral	655e5c4d2c46f3000877a54b	1578	2026-06-11 19:56:16.914968+00
b98788f0-a498-463e-9af8-e24c7008067a	TV SIM SD¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Geral	Sbtes.br	1579	2026-06-11 19:56:16.914968+00
377521b4-6806-4a2f-be53-d4fceddf16ce	BUBBLE GUPPIES | 24H+	https://googleplusimages.com/GIL.png	https://example.com/stream.m3u8	Geral	Bubbleguppies.24h	1580	2026-06-11 19:56:16.914968+00
6b833c89-eb3e-49a9-8fdf-a729f6173baf	TV BARRIGA VERDE HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandsc.br	1581	2026-06-11 19:56:16.914968+00
2886d4fb-ace9-440b-84ad-3170709d355c	PBR | RODEIO	http://googleplusimages.com/PBR.png	https://example.com/stream.m3u8	Geral	Ausente.br	1582	2026-06-11 19:56:16.914968+00
8716c1c6-36df-41f7-8a40-82546aa0e29b	SBT RS FHD¹	https://i.imgur.com/i4lyaIU.png	https://example.com/stream.m3u8	Abertos	Sbtrs.br	1583	2026-06-11 19:56:16.914968+00
efc8830a-3d4d-4865-ba26-6279cf20fdb1	TV GUARA CAXIAS FHD¹	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Geral	Redetvsp.br	1584	2026-06-11 19:56:16.914968+00
18cd4bad-fa07-4585-aca5-3c86d46cdc0f	IMPERIAL TV MARANHAO FHD¹	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Geral	Redetvsp.br	1585	2026-06-11 19:56:16.914968+00
43773adb-f3cf-4403-84e3-d13d2c608e6f	REDETV! TOCANTINS FHD¹	https://i.imgur.com/BA42JzV.png	https://example.com/stream.m3u8	Abertos	Redetvsp.br	1586	2026-06-11 19:56:16.914968+00
db596a70-07a8-4ef5-9b71-69b7c0861927	HALLO ANIME HD+	https://googleplusimages.com/HALLOANIME.png	https://example.com/stream.m3u8	Geral	3	1587	2026-06-11 19:56:16.914968+00
d9fdebc8-bc15-49f5-bc38-c24038e9a1d4	HALLO CLASSIC HD+	https://googleplusimages.com/HALLOCLASSIC.png	https://example.com/stream.m3u8	Geral	1	1588	2026-06-11 19:56:16.914968+00
03892da9-942f-4be5-b0dc-20313474e4d3	HALLO DOC HD+	https://googleplusimages.com/HALLODOC.png	https://example.com/stream.m3u8	Geral	4	1589	2026-06-11 19:56:16.914968+00
82279f2e-a433-43f1-acb9-6a03bd7a6b92	HALLO MOVIES HD+	https://googleplusimages.com/HALLOMOVIES.png	https://example.com/stream.m3u8	Geral	5	1590	2026-06-11 19:56:16.914968+00
a1fabc92-92ae-48db-8ea3-90be157a91aa	HALLO MUSIC HD+	https://googleplusimages.com/HALLOMUSIC.png	https://example.com/stream.m3u8	Geral	10	1591	2026-06-11 19:56:16.914968+00
fdaff869-b079-41e0-a2f2-29a3da3bc418	HALLO BRASIL HD¹	https://googleplusimages.com/HALLOBRASIL.png	https://example.com/stream.m3u8	Geral	9	1592	2026-06-11 19:56:16.914968+00
b6d610a8-d71a-4583-b217-2a599b5a2520	HALLO SERIES HD+	https://googleplusimages.com/HALLOSERIES.png	https://example.com/stream.m3u8	Geral	2	1593	2026-06-11 19:56:16.914968+00
e5c6a9c7-4b6e-4325-b4d8-58cd5a765e7e	PRIME VIDEO 1 HD¹	https://googleplusimages.com/PRIMEVIDEO.png	https://example.com/stream.m3u8	Geral	Primevideo.br	1594	2026-06-11 19:56:16.914968+00
a7d1b472-aa79-46a1-9ef8-dc92a6063bf4	PRIME VIDEO 2 HD¹	https://googleplusimages.com/PRIMEVIDEO.png	https://example.com/stream.m3u8	Geral	Primevideo.br	1595	2026-06-11 19:56:16.914968+00
6d31819e-69fa-4fc6-b6d5-d29f07069dde	PRIME VIDEO 3 HD¹	https://googleplusimages.com/PRIMEVIDEO.png	https://example.com/stream.m3u8	Geral	Primevideo.br	1596	2026-06-11 19:56:16.914968+00
e3933a2b-02df-46c6-8c46-8c3fd4264e4c	XSPORTS FHD¹	https://googleplusimages.com/XSPORTS.png	https://example.com/stream.m3u8	Geral	Xsports.br	1597	2026-06-11 19:56:16.914968+00
133c3dfa-5b5c-4d9c-8ce5-0697cf9eb6c7	XSPORTS HD¹	https://googleplusimages.com/XSPORTS.png	https://example.com/stream.m3u8	Geral	Xsports.br	1598	2026-06-11 19:56:16.914968+00
f9835f0c-ac8c-4030-bb29-5c06024d7223	TV GUARA HD+	https://googleplusimages.com/RECORDNEWS.png	https://example.com/stream.m3u8	Geral	Recordnews.br	1599	2026-06-11 19:56:16.914968+00
821d7f03-ac32-4136-899a-9679643c7991	(+18) 24H BISSEXUAIS	https://i.imgur.com/V6mSSbg.png	https://example.com/stream.m3u8	Variedades/Música	Adultos.br	1600	2026-06-11 19:56:16.914968+00
18d20aaa-9ba8-489e-a346-9d54c9ec8b8d	BAND BAHIA HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandba.br	1601	2026-06-11 19:56:17.0312+00
02573196-86fc-4663-b4bb-ce230d27578d	RECORD BAURU HD¹	http://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	1602	2026-06-11 19:56:17.0312+00
2d9b04c3-7abb-41eb-b66a-c6df65c500f5	SONY MOVIES HD¹	https://googleplusimages.com/SONYMOVIES.png	https://example.com/stream.m3u8	Filmes/Séries	Sonymovies.br	1603	2026-06-11 19:56:17.0312+00
4ec5e6f3-6312-42fa-8d78-7f4861df5628	GE TV HD+	https://googleplusimages.com/GETV.png	https://example.com/stream.m3u8	Geral	Getv.br	1604	2026-06-11 19:56:17.0312+00
7a8f41e7-74cb-4f5e-9834-ff85f5a534e6	REDE SECULO 21 FHD¹	https://googleplusimages.com/REDESECULO21.png	https://example.com/stream.m3u8	Geral	Redeseculo21.br	1605	2026-06-11 19:56:17.0312+00
daf1cbf4-c6b7-48c4-92e5-0e5d077aea00	GLOBO RIO HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Abertos	Globorj.br	1606	2026-06-11 19:56:17.0312+00
bce565cc-f1c3-4ab7-a132-0c014adc82d6	[LEG] UNIVERSAL TV HD²	https://googleplusimages.com/UNIVERSALTV.png	https://example.com/stream.m3u8	Filmes/Séries	Universaltv.br	1607	2026-06-11 19:56:17.0312+00
c1ba1bbb-932b-4f1d-81df-0454ae3c4c53	GE TV FHD¹	https://googleplusimages.com/GETV.png	https://example.com/stream.m3u8	Geral	Getv.br	1608	2026-06-11 19:56:17.0312+00
5f6e23b6-a90d-47a7-9d86-d959565d3931	GE TV FHDR¹	https://googleplusimages.com/GETV.png	https://example.com/stream.m3u8	Geral	Getv.br	1609	2026-06-11 19:56:17.0312+00
bcc6928c-1f29-4c02-8d90-ca69eba0647e	HBO MAX - SINAL 5 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax5.br	1610	2026-06-11 19:56:17.0312+00
bc61b27e-5c6e-4634-9b9c-8dfd7f2b5b0a	HBO MAX - SINAL 4 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax4.br	1611	2026-06-11 19:56:17.0312+00
8e19cf46-0f7b-4315-9e5c-690ffd17a78d	HBO MAX - SINAL 3 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax3.br	1612	2026-06-11 19:56:17.0312+00
2c084511-1ec9-4fa4-8fce-e68eefaed307	HBO MAX - SINAL 2 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax2.br	1613	2026-06-11 19:56:17.0312+00
d9027c01-3d3a-4e9e-b0c9-22d0b08b9540	HBO MAX - SINAL 1 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax1.br	1614	2026-06-11 19:56:17.0312+00
24f2eaf4-1cb6-4c24-ad23-5ccbef147be1	HBO MAX - SINAL 8 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	Tntsports.br	1615	2026-06-11 19:56:17.0312+00
7565c383-688b-474a-b247-de38464804aa	HBO MAX - SINAL 7 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax7.br	1616	2026-06-11 19:56:17.0312+00
cea582e8-29f2-4b61-85e2-05ebd0f0cfc6	HBO MAX - SINAL 6 HD¹	https://googleplusimages.com/HBOMAX.png	https://example.com/stream.m3u8	Filmes/Séries	hbomax6.br	1617	2026-06-11 19:56:17.0312+00
829b430b-4ee9-44a2-a377-998f3c1c14b3	CAZETV | ESPORTES+	https://googleplusimages.com/CAZETV.png	https://example.com/stream.m3u8	Geral	Cazetv.br	1618	2026-06-11 19:56:17.0312+00
e9a983b0-a7dd-4906-8452-4878437006fc	COCOMELON | 24H+	https://googleplusimages.com/COCOMELON.png	https://example.com/stream.m3u8	Geral	Cocomelon.24h	1619	2026-06-11 19:56:17.0312+00
e2824214-f876-4efa-be23-f0b2c00bae0f	LENDAS URBANAS | 24H+	https://googleplusimages.com/LENDASURBANAS.png	https://example.com/stream.m3u8	Geral	Lendasurbanas.24h	1620	2026-06-11 19:56:17.0312+00
b1100557-f7d0-4f26-b991-fc95827e2f57	A CASA DO MICKEY MOUSE | 24H+	https://googleplusimages.com/ACASADOMICKEYMOUSE.png	https://example.com/stream.m3u8	Geral	Acasadomickeymouse.24h	1621	2026-06-11 19:56:17.0312+00
e15b1c0d-cbe6-45a8-a9c8-63b75fabfb01	BABY SHARK: O GRANDE SHOW | 24H+	https://googleplusimages.com/BABYSHARKOGRANDESHOW.png	https://example.com/stream.m3u8	Geral	Babysharkgrandeshow.24h	1622	2026-06-11 19:56:17.0312+00
3cc3998b-49d3-4c0b-a168-ebf15c83834a	BOB ZOOM | 24H+	https://googleplusimages.com/BOBZOOM.png	https://example.com/stream.m3u8	Geral	Bobzoom.24h	1623	2026-06-11 19:56:17.0312+00
9619f5bb-84e2-4b18-a1f1-375cf8caa7ff	MUNDO BITA | 24H+	https://googleplusimages.com/MUNDOBITA.png	https://example.com/stream.m3u8	Geral	Mundobita.24h	1624	2026-06-11 19:56:17.0312+00
0e92798a-999c-457f-9443-06b1b0c42df2	RÁDIO BITA | 24H+	https://googleplusimages.com/RADIOBITA.png	https://example.com/stream.m3u8	Geral	Radiobita.24h	1625	2026-06-11 19:56:17.0312+00
45864ebd-70db-4bf0-94f7-3e0a33b890bd	QUE LEGAL SCOOBY DOO | 24H+	https://googleplusimages.com/QUELEGALSCOOBYDOO.png	https://example.com/stream.m3u8	Geral	Legalscoobydoo.24h	1626	2026-06-11 19:56:17.0312+00
5f633539-d975-45d9-96a7-94c1c872190e	BABY LOONEY TUNES | 24H+	https://googleplusimages.com/BABYLOONEYTUNES.png	https://example.com/stream.m3u8	Geral	Babylooneytunes.24h	1627	2026-06-11 19:56:17.0312+00
f0068d66-4011-46ad-a2ac-eb3154f0377a	HI HI PUFFY AMIYUMI | 24H+	https://googleplusimages.com/PUFFY.png	https://example.com/stream.m3u8	Geral	Amiyumi.24h	1628	2026-06-11 19:56:17.0312+00
4287b0ac-796d-4050-b29a-c4e871c9d0a1	HORA DE AVENTURA | 24H+	https://googleplusimages.com/HORADEAVENTURA.png	https://example.com/stream.m3u8	Geral	Horadeaventura.24h	1629	2026-06-11 19:56:17.0312+00
a2b30950-d668-4a92-b7a2-fd21121c3648	O INCRIVEL MUNDO DE GUMBALL | 24H+	https://googleplusimages.com/GUMBALL.png	https://example.com/stream.m3u8	Geral	Gumball.24h	1630	2026-06-11 19:56:17.0312+00
80925ff5-7f7d-4ad9-bcf3-7e538e122780	POKEMON JORNADAS | 24H+	https://googleplusimages.com/POKEMONJORNADAS.png	https://example.com/stream.m3u8	Geral	Pokemonjornadas.24h	1631	2026-06-11 19:56:17.0312+00
88ff9d9d-6717-4812-ad86-fd64210e11da	SIMON | 24H+	https://googleplusimages.com/SIMON.png	https://example.com/stream.m3u8	Geral	Simon.24h	1632	2026-06-11 19:56:17.0312+00
84a971f9-6de6-4df3-95f3-f172b61f2fc0	iCARLY | 24H+	https://googleplusimages.com/ICARLY.png	https://example.com/stream.m3u8	Geral	iCarly.24h	1633	2026-06-11 19:56:17.0312+00
ec037f25-1efc-4d44-a2e6-6a5605e40a28	TV SERRA DOURADA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtgo.br	1634	2026-06-11 19:56:17.0312+00
a894a746-4b87-4388-be0a-afca5daa508c	TV SUCESSO HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandgo.br	1635	2026-06-11 19:56:17.0312+00
77df5e8b-9590-4916-a78f-b1995c79a2d8	QUE HISTORIA E ESSA PORCHAT T1 | 24H+	https://googleplusimages.com/PORCHAT.png	https://example.com/stream.m3u8	Geral	Porchat.24h	1636	2026-06-11 19:56:17.0312+00
1e6dca25-d4f5-42a9-8899-b83d2e73bad0	A ESCOLINHA DO GOLIAS | 24H+	https://googleplusimages.com/GOLIAS.png	https://example.com/stream.m3u8	Geral	Escolinhagolias.24h	1637	2026-06-11 19:56:17.0312+00
f60e61d6-a6cf-42d7-9b5b-75715a8ce116	AS TERRIVEIS AVENTURAS DE BILLY E MANDY | 24H+	https://googleplusimages.com/PUROOSSO.png	https://example.com/stream.m3u8	Geral	Billymandy.24h	1638	2026-06-11 19:56:17.0312+00
fff365ce-0c70-4dfb-887f-ab3361ef7cf7	BEN 10: FORCA ALIENIGENA | 24H+	https://googleplusimages.com/BEN103.png	https://example.com/stream.m3u8	Geral	Ben103.24h	1639	2026-06-11 19:56:17.0312+00
eac153ce-f5db-4e5b-86e0-dd14f4dcb64c	DRAGON BALL DAIMA | 24H+	https://googleplusimages.com/DBDAIMA.png	https://example.com/stream.m3u8	Geral	Dbdaima.24h	1640	2026-06-11 19:56:17.0312+00
457a3d5a-1362-4ffa-97af-82b3f1ef97ad	A FAMILIA ADDAMS (1964) | 24H+	https://googleplusimages.com/WANDINHA1.png	https://example.com/stream.m3u8	Geral	Addams.24h	1641	2026-06-11 19:56:17.0312+00
94fff2db-f2f6-4952-bd1b-a2b740470660	BEYBLADE BURST EVOTUION | 24H+	https://googleplusimages.com/BEYBLADE3.png	https://example.com/stream.m3u8	Geral	Beyblade3.24h	1642	2026-06-11 19:56:17.0312+00
f966aa43-a22d-4a0b-8835-ceb6a81213d7	BEYBLADE BURST TURBO | 24H+	https://googleplusimages.com/BEYBLADE3.png	https://example.com/stream.m3u8	Geral	Beyblade3.24h	1643	2026-06-11 19:56:17.0312+00
6b15053f-8eb4-4be3-a932-8ead996a61d3	BEYBLADE X | 24H+	https://googleplusimages.com/BEYBLADE4.png	https://example.com/stream.m3u8	Geral	Beyblade4.24h	1644	2026-06-11 19:56:17.0312+00
badd63d5-36d8-4a26-aa40-c01f7fe2ed71	CACADORES DE DINOSSAUROS | 24H+	https://googleplusimages.com/CACADORESDINO.png	https://example.com/stream.m3u8	Geral	Cacadoresdino.24h	1645	2026-06-11 19:56:17.0312+00
5181c24a-0496-4c4f-8fab-f17a85ed7224	AEROPORTO: AREA RESTRITA | 24H+	https://googleplusimages.com/AREARESTRITA.png	https://example.com/stream.m3u8	Geral	Aeroporto.24h	1646	2026-06-11 19:56:17.0312+00
cacb993a-cd88-4aeb-b5d0-787f3b5f95e3	A FAMILIA ADDAMS (1992) | 24H+	https://googleplusimages.com/GOMEZ.png	https://example.com/stream.m3u8	Geral	Addamsdesenho2.24h	1647	2026-06-11 19:56:17.0312+00
1425f5e8-a4d3-4037-b0eb-18b4800f4b03	BEN 10: OMNIVERSE | 24H+	https://googleplusimages.com/BEN105.png	https://example.com/stream.m3u8	Geral	Ben105.24h	1648	2026-06-11 19:56:17.0312+00
af3c153d-66ec-4c1e-ae5e-a77d5663abf9	BEN 10 (2016) | 24H+	https://googleplusimages.com/BEN102.png	https://example.com/stream.m3u8	Geral	Ben102.24h	1649	2026-06-11 19:56:17.0312+00
3ccc9447-d2f6-4d6e-b5ec-4bc8d805bfd8	A PANTERA COR DE ROSA (1993) | 24H+	https://googleplusimages.com/PANTERA2.png	https://example.com/stream.m3u8	Geral	Apanteracorderosa2.24h	1650	2026-06-11 19:56:17.0312+00
d9f7944e-c4cc-4e97-8a32-c1667a1e3b2d	DUCKTALES (2017) | 24H+	Hfj	https://example.com/stream.m3u8	Geral	Bandnews.br	1651	2026-06-11 19:56:17.0312+00
61e7185e-cf5a-4cc6-948f-4f8165d4607f	COCORICO | 24H+	https://googleplusimages.com/COCORICO.png	https://example.com/stream.m3u8	Geral	Cocorico.24h	1652	2026-06-11 19:56:17.0312+00
38570eb6-246e-4121-8214-af9b0766fca8	OTAKU HD+	https://googleplusimages.com/OTAKUTV.png	https://example.com/stream.m3u8	Geral	Ausente.br	1653	2026-06-11 19:56:17.0312+00
03f59760-3ed7-4b50-9860-de35727d3f4e	CINEBRASILTV HD+	https://googleplusimages.com/CINEBRASILTV.png	https://example.com/stream.m3u8	Geral	Cinebrasiltv.br	1654	2026-06-11 19:56:17.0312+00
e16dd569-6256-404b-95e3-3234ab22abca	GLN TV HD+	https://googleplusimages.com/GLNTV.png	https://example.com/stream.m3u8	Geral	Glntv.br	1655	2026-06-11 19:56:17.0312+00
7a26bbeb-cfcb-44b4-8319-9e74c96ed222	MBC BRASIL HD+	https://googleplusimages.com/MBCBRASIL.png	https://example.com/stream.m3u8	Geral	Mbcbrtv.br	1656	2026-06-11 19:56:17.0312+00
2f33a622-8f46-45ba-83ee-06cc2c1da2c1	FUEL TV | ESPORTES+	https://googleplusimages.com/FUELTV.png	https://example.com/stream.m3u8	Geral	Ausente.br	1657	2026-06-11 19:56:17.0312+00
130104b1-d41c-4776-843b-1ab4c3fe9fb8	RACER BRASIL | ESPORTES+	https://googleplusimages.com/RACERBRASIL.png	https://example.com/stream.m3u8	Geral	65a6818c7bdc8d0008457b21	1658	2026-06-11 19:56:17.0312+00
c2b4f7a0-75e9-43ba-be79-e2924b2f6860	NSPORTS | ESPORTES+	https://googleplusimages.com/NSPORTS.png	https://example.com/stream.m3u8	Geral	Ausente.br	1659	2026-06-11 19:56:17.0312+00
e1e48726-38bd-4bd1-8a3d-7355aef9e6a8	FIFA+ | ESPORTES+	https://googleplusimages.com/FIFAPLUS.png	https://example.com/stream.m3u8	Geral	Fifaplus.br	1660	2026-06-11 19:56:17.0312+00
7a30b116-0c3a-4cc7-a647-251833ad778e	SESSAO TRASH | FILMES+	https://googleplusimages.com/SESSAOTRASH.png	https://example.com/stream.m3u8	Geral	Sessaotrash.br	1661	2026-06-11 19:56:17.0312+00
ccbd1be0-8b42-4b0a-9d30-59e2da241ec8	TIMES BRASIL HD+	https://googleplusimages.com/TIMESBRASIL.png	https://example.com/stream.m3u8	Geral	Timescnbc.br	1662	2026-06-11 19:56:17.0312+00
324d2a77-54e2-4a60-a568-9165a0960d76	TV JORNAL HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpe.br	1663	2026-06-11 19:56:17.0312+00
8a14cbab-51f8-4d08-9c76-44e45e9105f4	GPTV | ESPORTES+	https://googleplusimages.com/GPTV.png	https://example.com/stream.m3u8	Geral	Ausente.br	1664	2026-06-11 19:56:17.0312+00
3a1a0258-6789-46e2-9cb7-9dace19386cf	INTERTV DOS VALES HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globors.br	1665	2026-06-11 19:56:17.0312+00
877ecc29-2e00-460e-8416-5500f7267f18	INTERTV DOS VALES FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Intertvmg.br	1666	2026-06-11 19:56:17.0312+00
0f3050ee-d4ef-4953-ac8a-42fb0dbe90b3	BM&C NEWS HD¹	https://googleplusimages.com/BMCNEWS.png	https://example.com/stream.m3u8	Geral	Bmcnews.br	1667	2026-06-11 19:56:17.0312+00
287c8042-2ca4-4296-8b4c-b39f5b759697	CARAVANA PLAY HD+	https://googleplusimages.com/CARAVANAPLAY.png	https://example.com/stream.m3u8	Geral	Caravana.br	1668	2026-06-11 19:56:17.0312+00
b9a3bfd2-be26-44ef-97c2-a77311790de7	CANAL START HD+	https://googleplusimages.com/START.png	https://example.com/stream.m3u8	Filmes/Séries	canalstart.br	1669	2026-06-11 19:56:17.0312+00
72e8c516-81a9-4adb-8ee4-b67890ed305d	NATURETIME | CURIOSIDADES+	https://googleplusimages.com/NATURETIME.png	https://example.com/stream.m3u8	Geral	681ba2ad93d3d19bcab47433	1670	2026-06-11 19:56:17.0312+00
927f6bef-6e95-4dc8-913a-317724ff044b	BAND MAIS HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandmais.br	1671	2026-06-11 19:56:17.0312+00
00b8b1e3-5afc-4b0e-9bf8-9be23b0f7a00	TV EVANGELIZAR HD¹	https://i.imgur.com/CDFS1c9.png	https://example.com/stream.m3u8	Geral	Tvevangelizar.br	1672	2026-06-11 19:56:17.0312+00
0d6fa0df-5e87-4a0a-b17d-631c87d0250e	TV CIDADE VERDE PICOS HD+	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Geral	Sbtpi.br	1673	2026-06-11 19:56:17.0312+00
b464cb9d-44af-4bca-8202-43f9983aa54d	U CHANNEL HD+	https://googleplusimages.com/UCHANNEL.png	https://example.com/stream.m3u8	Geral	Uchannel.br	1674	2026-06-11 19:56:17.0312+00
dd1a019d-8adf-43c0-b575-73b494b1aaf6	AMAZON SAT FHD+	https://googleplusimages.com/AMAZONSAT.png	https://example.com/stream.m3u8	Geral	Amazonsat.br	1675	2026-06-11 19:56:17.0312+00
a91ac378-3eee-42ca-b301-e87b4da5ff93	RPC CURITIBA HD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopr.br	1676	2026-06-11 19:56:17.0312+00
baf9875d-2e2c-4b6b-89be-dc9bd183ac7e	13/01 21:30 Carolina Hurricanes x St. Louis Blues PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019b9f2f-3bf3-7a25-aa0d-b5e3b083ce65/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1677	2026-06-11 19:56:17.0312+00
2199a02d-ac9a-426b-a31c-476686902455	13/01 21:30 Detroit Red Wings x Boston Bruins PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019b6ad7-a8ab-7dbb-8769-f9b65653f8ac/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1678	2026-06-11 19:56:17.0312+00
c01094eb-162c-4d3d-8a4e-c50a912060c7	TV CIDADE VERDE MT FHD+	https://portalbsd.com.br/images/tv/tvcv.png	https://example.com/stream.m3u8	Geral	Jpnews.br	1679	2026-06-11 19:56:17.0312+00
64e1896a-dfa0-4bb4-b2db-399c7cdfb73f	AMC SERIES HD+	https://googleplusimages.com/AMC.png	https://example.com/stream.m3u8	Filmes/Séries	Amc.br	1680	2026-06-11 19:56:17.0312+00
55ceb5b5-4e3e-495c-ada1-15a7aee0ee82	SBT AMAZONAS HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtam.br	1681	2026-06-11 19:56:17.0312+00
4e778151-4809-4240-833c-15bd82259d34	BAND AMAZONAS HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandma.br	1682	2026-06-11 19:56:17.0312+00
2bdbc8cb-1803-465e-aea7-5cf71c93677f	RECORD MATO GROSSO HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordms.br	1683	2026-06-11 19:56:17.0312+00
0effb39a-9163-4e27-b672-b7e5b586fbe8	UNIVERSAL REALITY HD²	https://googleplusimages.com/UNIVERSALPLUS.png	https://example.com/stream.m3u8	Filmes/Séries	Universalreality.br	1684	2026-06-11 19:56:17.0312+00
34d85fa8-0afb-4ebf-90fb-7dbedb9e19e4	TVE RS HD+	https://googleplusimages.com/TVBRASIL.png	https://example.com/stream.m3u8	Geral	Tvbrasilrs.br	1685	2026-06-11 19:56:17.0312+00
f0a70fdb-b46a-40bc-95fa-cc21f0215641	CNN MONEY HD¹	https://googleplusimages.com/CNNMONEY.png	https://example.com/stream.m3u8	Notícias	Cnnmoney.br	1686	2026-06-11 19:56:17.0312+00
a4c7fc4d-be8e-4d75-8603-9c15ff4b9e35	TVE INTERNACIONAL HD¹	https://googleplusimages.com/TVEINTERNACIONAL.png	https://example.com/stream.m3u8	Geral	Tvei.br	1687	2026-06-11 19:56:17.0312+00
61bbde61-7f93-4c22-a9bf-347128ab3efb	SBT CAMPINAS HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	1688	2026-06-11 19:56:17.0312+00
e1797c9f-6d36-48b4-b540-332c17a76650	TIMES BRASIL | CNBC HD¹	https://googleplusimages.com/TIMESBRASIL.png	https://example.com/stream.m3u8	Geral	Timescnbc.br	1689	2026-06-11 19:56:17.0312+00
6d6fd91b-ed30-4934-80e4-5a1ceea0a934	RIT HD¹	https://i.imgur.com/LJDsM13.png	https://example.com/stream.m3u8	Geral	Rit.br	1690	2026-06-11 19:56:17.0312+00
1cc8ed0d-a6d8-4729-a05f-ff71d940bfc1	REDE VIDA FHD¹	https://i.imgur.com/PFjpu5s.png	https://example.com/stream.m3u8	Abertos	Redevida.br	1691	2026-06-11 19:56:17.0312+00
a9ca946e-f185-4683-a31f-afeac274bee7	RECORD SP FHD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordsp.br	1692	2026-06-11 19:56:17.0312+00
09fe1a7a-843a-4997-97ed-471b2f9b4dfb	TV BRASILIA HD¹	https://googleplusimages.com/REDETV!.png	https://example.com/stream.m3u8	Geral	Redetvdf.br	1693	2026-06-11 19:56:17.0312+00
222e4f66-b3b9-4f9b-b255-4f50fe9baccc	TV TRIBUNA PE HD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Geral	Bandpe.br	1694	2026-06-11 19:56:17.0312+00
7288f585-8220-45b7-8a9e-4dc6829119f9	CANAL GOV HD+	https://googleplusimages.com/CANALGOV.png	https://example.com/stream.m3u8	Geral	Canalgov.br	1695	2026-06-11 19:56:17.0312+00
94a68d13-c705-4cfd-b0fb-66d6cda531df	TV CAMARA HD¹	https://googleplusimages.com/TVCAMARA.png	https://example.com/stream.m3u8	Geral	Tvcamara.br	1696	2026-06-11 19:56:17.0312+00
3b7c4279-f28d-4630-a4ee-b2747f0cbc65	RECORD GUAÍBA RS HD¹	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordes.br	1697	2026-06-11 19:56:17.0312+00
4665c057-b4a7-4392-8800-856d76e2a8af	DISCOVERY KIDS HD¹	https://googleplusimages.com/DISCOVERYKIDS.png	https://example.com/stream.m3u8	Documentários	Discoverykids.br	1698	2026-06-11 19:56:17.0312+00
128dc02e-6de6-4c87-ab39-5e8f3f4a5668	COPA DO BRASIL 01 HD¹	https://googleplusimages.com/COPADOBRASIL.png	https://example.com/stream.m3u8	Geral	Copadobrasil.br	1699	2026-06-11 19:56:17.0312+00
6335313e-82da-43fe-8719-3d4dae0bf749	COPA DO BRASIL 02 HD¹	https://googleplusimages.com/COPADOBRASIL.png	https://example.com/stream.m3u8	Geral	Copadobrasil.br	1700	2026-06-11 19:56:17.0312+00
7a3854ee-4d60-43ee-a3d9-13ead92d5192	COPA DO BRASIL 03 HD¹	https://googleplusimages.com/COPADOBRASIL.png	https://example.com/stream.m3u8	Geral	Copadobrasil.br	1701	2026-06-11 19:56:17.0312+00
d026c307-21db-42a6-81e4-d1663aefe4ba	COPA DO BRASIL 04 HD¹	https://googleplusimages.com/COPADOBRASIL.png	https://example.com/stream.m3u8	Geral	Copadobrasil.br	1702	2026-06-11 19:56:17.0312+00
213f9015-6fda-4297-a124-bae7be2b24b0	RECORD PIAUI HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Abertos	Recordpi.br	1703	2026-06-11 19:56:17.0312+00
5202cda5-9976-4123-9d8c-4e0bddbb4be7	HALLO DORAMA HD+	https://s3minio.webativa.com.br/redeitv/thumb-hallo-dorama.png	https://example.com/stream.m3u8	Geral	6	1704	2026-06-11 19:56:17.0312+00
f72cca1c-435c-494f-9846-43328dbf1f38	NDTV JOINVILLE HD²	https://googleplusimages.com/RECORD.png	https://example.com/stream.m3u8	Geral	Recordsc.br	1705	2026-06-11 19:56:17.0312+00
62ed4104-75a9-4faa-9e09-715e73b25d13	HALLO MOVIES 2 HD+	https://googleplusimages.com/HALLOMOVIES.png	https://example.com/stream.m3u8	Geral	8	1706	2026-06-11 19:56:17.0312+00
8138236c-44bb-4318-8976-77be5f84e91c	SABOR & ARTE 2 FHD¹	https://googleplusimages.com/SABOR&ARTE.png	https://example.com/stream.m3u8	Geral	Saborearte.br	1707	2026-06-11 19:56:17.0312+00
7033fb5f-5e07-41fb-951e-a5a8b1257e63	SBT SOROCABA HD¹	https://googleplusimages.com/SBT.png	https://example.com/stream.m3u8	Abertos	Sbtsp.br	1708	2026-06-11 19:56:17.0312+00
be0806dc-b616-4b54-ab00-67875d49cd9e	REDE MINAS HD²	http://googleplusimages.com/REDEMINAS.png	https://example.com/stream.m3u8	Geral	Redeminas.br	1709	2026-06-11 19:56:17.0312+00
25b0f8a3-93a2-4bd1-817d-baa20f8de911	CAZETV - SINAL 3 PPV+ [CAZE]	https://googleplusimages.com/CAZETV.png	https://example.com/stream.m3u8	Geral	Caze.br	1710	2026-06-11 19:56:17.0312+00
c5adfa59-cc4c-4387-a311-3ce9f77bb120	CAZETV - SINAL 2 PPV+ [CAZE]	https://googleplusimages.com/CAZETV.png	https://example.com/stream.m3u8	Geral	Caze.br	1711	2026-06-11 19:56:17.0312+00
40babf91-19d9-44bb-ad97-6eebcffe917c	CAZETV - SINAL 1 PPV+ [CAZE]	https://googleplusimages.com/CAZETV.png	https://example.com/stream.m3u8	Geral	Caze.br	1712	2026-06-11 19:56:17.0312+00
452656cc-7ad0-4bad-9a10-1020bf4520fc	TV PARAÍBA FHD¹	https://googleplusimages.com/GLOBO.png	https://example.com/stream.m3u8	Geral	Globopb.br	1713	2026-06-11 19:56:17.0312+00
00902123-ba4c-49f0-a0dc-16bd3fc2a9a0	BAND CEARÁ FHD¹	https://googleplusimages.com/BAND.png	https://example.com/stream.m3u8	Abertos	Bandce.br	1714	2026-06-11 19:56:17.0312+00
2d5d3b63-34b5-45c8-8d26-388be4a40e16	NICK JR. CLUB	https://images.pluto.tv/channels/6824ce95f09106f4b18f4114/thumbnail.jpg	https://example.com/stream.m3u8	Infantil	6824ce95f09106f4b18f4114	1715	2026-06-11 19:56:17.0312+00
65116e9e-cc0f-4ff5-892d-b18973ef18cb	13/06 07:00 ETERNAL MMA 107 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/03180146-nssv8efo3qpxrysb.jpg	https://example.com/stream.m3u8	Geral	None	1716	2026-06-11 19:56:17.0312+00
45d941a0-f5ce-4563-a226-913c09a760c4	20/06 14:30 CAGE WARRIORS 207 PRELIMS PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/26172749-akvyjb61y9obki1l.jpg	https://example.com/stream.m3u8	Geral	None	1717	2026-06-11 19:56:17.0312+00
721e98fa-992c-4719-a5b0-3cdee3e35635	19/06 21:30 CAGE FURY FC 155 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/26172639-tjvj5tmeszomwkbd.png	https://example.com/stream.m3u8	Geral	None	1718	2026-06-11 19:56:17.0312+00
96a1d66a-a769-4100-85b6-ef9385e1b432	19/06 16:00 CAGE WARRIORS 206: UNPLUGGED PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/26172439-kxdfdme65hibu0ur.jpg	https://example.com/stream.m3u8	Geral	None	1719	2026-06-11 19:56:17.0312+00
8d3ca319-64d7-4990-ad2c-f045222baf12	20/06 17:30 CAGE WARRIORS 207 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/26174909-qn7suillc3slyfuk.jpg	https://example.com/stream.m3u8	Geral	None	1720	2026-06-11 19:56:17.0312+00
93a37661-0baa-4a06-b4c5-fd141ebb1d54	13/06 22:00 COMBAT FC 13 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/13165439-2b1cv8rfv1qsapym.jpg	https://example.com/stream.m3u8	Geral	None	1721	2026-06-11 19:56:17.0312+00
4d672034-9902-4d32-afc0-c3689d05ccec	13/06 20:30 UFC FREEDOM 250: CEREMONIAL WEIGH-IN SHOW PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/08131624-rvoawfptm1qi2cjn.jpg	https://example.com/stream.m3u8	Geral	None	1722	2026-06-11 19:56:17.0312+00
dac6af4b-f00b-4e1c-b311-c235ca43fa10	13/06 05:30 SHURIKEN FIGHT SERIES 24 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/04193633-1xkbyym9d2vb9kxg.jpg	https://example.com/stream.m3u8	Geral	None	1723	2026-06-11 19:56:17.0312+00
2b779bdd-4264-4fb2-9e7f-30c35dbe786b	13/06 03:00 ZFN ORIGIN 04 PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/08175644-jbztg15ffyu58fra.jpeg	https://example.com/stream.m3u8	Geral	None	1724	2026-06-11 19:56:17.0312+00
56b8fd71-60f2-4117-9634-095ee53aa1d3	12/06 21:15 UFC FREEDOM 250: PRESS CONFERENCE PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/08131426-gxs7kg65jtptq7oa.jpg	https://example.com/stream.m3u8	Geral	None	1725	2026-06-11 19:56:17.0312+00
3ae472a3-4d2b-48ac-b7e7-fa539a1a7eb9	11/06 00:00 Ao Vivo: VOD | Mercado Livre (CazéTV) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/30570a4a-763e-4486-b431-eae91bbb59f6/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1726	2026-06-11 19:56:17.0312+00
a497cd07-e9d2-4e94-a5b7-39065d9070cd	11/06 00:00 SportsCenter Última Edição PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/1dc94821-38cd-4907-9837-bd7d3f9d8273/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1727	2026-06-11 19:56:17.0312+00
78cc8aa8-624d-4331-ac18-03ee4acc3b63	11/06 00:00 AV Alta FC x Sarasota Paradise PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e5531-aacf-7ded-a6d3-5139d9dbea00/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1728	2026-06-11 19:56:17.0312+00
229eff42-e2cf-431e-9766-a668c69741d9	12/06 19:00 CMP BOXING: HALL OF FAME FIGHT NIGHT PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/06/09170811-1wznnnsbvx9p2nna.jpeg	https://example.com/stream.m3u8	Geral	None	1729	2026-06-11 19:56:17.0312+00
2fa858f3-e662-480f-a9b1-cf2751a081b1	12/06 00:00 In the Crease PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/8fc93129-e295-49a4-8633-3ac0b328d891/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1730	2026-06-11 19:56:17.0312+00
7a7a4b96-953e-4f4a-803a-87e4d9ab375c	11/06 23:30 Halcones de Cd. Obregón x Frayles de Guasave (Semifinal, Juego 4) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e8fcf-8b23-7e32-84cd-0036c53b6558/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1731	2026-06-11 19:56:17.0312+00
3c430d75-cb00-4590-90ff-f53cb828203f	11/06 23:00 SportsCenter PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/005414fa-7eb0-47e2-ba7c-fc2b55c1c406/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1732	2026-06-11 19:56:17.0312+00
31a00167-5c86-40ed-956f-124fff1c8406	11/06 22:40 2026 NCAA Division I Outdoor Track and Field Championships - Women's Long Jump PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/703a0947-b1b5-4434-9581-0e5c409bcc6c/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1733	2026-06-11 19:56:17.0312+00
5a789a1a-3772-4b57-b2f3-8398fe6c14ea	11/06 22:15 2026 NCAA Division I Outdoor Track and Field Championships - Women's Javelin PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/703a0947-b1b5-4434-9581-0e5c409bcc6c/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1734	2026-06-11 19:56:17.0312+00
f0e9279a-554a-449d-b604-42a5ebfec1a8	11/06 22:00 Bandits x Talons PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ee7568a5-b1cf-44bd-aeda-5b92f2b5f69b/compose?format=png	https://example.com/stream.m3u8	Abertos	Disney.br	1735	2026-06-11 19:56:17.0312+00
dede0e51-616d-4917-ae46-820091ed2d40	11/06 21:55 Toros de Tijuana x El Águila de Veracruz PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e2d1e-0096-7a7b-bc7f-843694acec45/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1736	2026-06-11 19:56:17.0312+00
210294da-7473-4d70-9c83-bcfb9f6fa8c7	11/06 21:55 Saraperos de Saltillo x Pericos de Puebla PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e2d15-e154-7953-bd1b-a6309c55a27d/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1737	2026-06-11 19:56:17.0312+00
6440da03-3580-474e-a361-adafe9328479	11/06 21:30 Linha de Passe PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eb41a-3fa9-799f-9650-62bb1e5a5682/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1738	2026-06-11 19:56:17.0312+00
2b9211b0-9994-4bf3-a145-cab98a6ec5fb	11/06 21:30 Coreia do Sul x  Tchéquia (CazéTV) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eae4a-dc11-7f00-8356-eb3c37a1163d/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1739	2026-06-11 19:56:17.0312+00
5aa0a49e-5907-491c-ad19-5e38fc193982	11/06 21:00 NCAA Outdoor Track & Field Championships (Women's Day 1) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/703a0947-b1b5-4434-9581-0e5c409bcc6c/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1740	2026-06-11 19:56:17.0312+00
ddd0107a-b2bc-4aab-920b-8b08ddcf2c02	11/06 21:00 Vegas Golden Knights x Carolina Hurricanes (Stanley Cup Final Game 5) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e98da-27f5-71a8-aa85-249bb17922d8/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1741	2026-06-11 19:56:17.0312+00
e42edc14-5771-4d3b-a310-c9daa4c4b896	11/06 20:45 O dia no Mundial (Xsports) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019a6efa-e38c-798d-9bf0-9aad38c11b17/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1742	2026-06-11 19:56:17.0312+00
71b6ca79-dd89-4507-8849-a31f0e273436	11/06 20:30 ESPN League PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/fc3340ce-5ee1-423a-8377-558eb6642210/compose?format=png	https://example.com/stream.m3u8	Esportes	Disney.br	1743	2026-06-11 19:56:17.0312+00
c5253273-7331-4430-9fc7-2a99ab6074a4	11/06 20:00 Casa CazéTV (CazéTV) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/30570a4a-763e-4486-b431-eae91bbb59f6/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1744	2026-06-11 19:56:17.0312+00
2548aa61-76bc-4428-9e21-af6e2356b7c7	11/06 20:00 The Point PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/fbf8f65a-5455-4ff4-a935-d07a6e12b7ba/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1745	2026-06-11 19:56:17.0312+00
da07b173-cdcd-4b76-8e93-15e749e0affe	11/06 20:00 Seattle Mariners x Baltimore Orioles PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e64cd-a75d-72fa-8e13-19ef1b823410/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1746	2026-06-11 19:56:17.0312+00
94f2219b-7a80-41e6-982c-d5681d533adb	11/06 19:30 Equipe F PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eb419-b6dd-75c2-bd42-f40b471497fc/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1747	2026-06-11 19:56:17.0312+00
58b62845-3a27-4450-8a3b-f3df47eab27e	11/06 19:20 Santo André x Araraquara PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e8877-3d71-7e45-9475-611f58e6b6bc/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1748	2026-06-11 19:56:17.0312+00
7f682b14-65ab-478b-8733-d656b40752fa	11/06 19:00 Resenha PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eb2c3-7c41-7902-a37f-0e046bd406db/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1749	2026-06-11 19:56:17.0312+00
bb75a55c-404f-4028-a549-316dd10149ce	11/06 18:50 São Caetano x Dracena (Xsports) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eac45-4b4c-7c21-a868-05d64b72ea9e/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1750	2026-06-11 19:56:17.0312+00
ba8b5b5d-fee0-4e18-a591-ce1569262e35	11/06 18:30 Mundo Futsal (Xsports) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019a6efa-e38c-798d-9bf0-9aad38c11b17/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1751	2026-06-11 19:56:17.0312+00
22316a54-545a-4619-88db-a155f5575a2a	11/06 18:00 Mundo F PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eb425-3e66-7646-9d95-8429bf862acf/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1752	2026-06-11 19:56:17.0312+00
3e4bf06d-7bb1-47e9-8a47-a11aadc8bdbf	11/06 18:00 CopaZona - Dia 1 (CazéTV) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/6c457408-df23-429a-ab20-8a2c6cc1e945/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1753	2026-06-11 19:56:17.0312+00
f2227ecd-b310-4cb7-a448-f8248561d88b	11/06 17:30 Especial Mundial - Segunda Edição (Xsports) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019a6efa-e38c-798d-9bf0-9aad38c11b17/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1754	2026-06-11 19:56:17.0312+00
d8e0a78e-cceb-4ad2-bf7e-275dc94740fd	11/06 15:45 México x África do Sul (CazéTV) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eae03-a5f7-70ae-a6cb-a6af3c2aaad9/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1755	2026-06-11 19:56:17.0312+00
35ee4005-9957-4730-bbbf-5d1e67287630	11/06 15:35 2026 NCAA Division I Outdoor Track and Field Championships - Men's Decathlon - Discus PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/703a0947-b1b5-4434-9581-0e5c409bcc6c/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1756	2026-06-11 19:56:17.0312+00
80d0e4ff-c03d-4f7c-bb63-4fd064b2dfc7	11/06 05:00 Premier Padel: Valencia - Secondary Court (Octavos de Final) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e88f3-9341-7d31-af88-54eafee27bc5/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1757	2026-06-11 19:56:17.0312+00
50add282-afb6-4fcf-8c8a-d30882146f6e	11/06 05:00 Premier Padel: Valencia - Centre Court (Octavos de Final) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e88f5-43ed-73f1-995b-06c6e2aeaf3d/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1758	2026-06-11 19:56:17.0312+00
fbf7e7af-b4b1-49a1-abba-2f3c069c60a0	12/06 01:00 SportsCenter PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/5f630d83-b9c1-4438-9487-764d1df148df/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1759	2026-06-11 19:56:17.0312+00
cb1052d5-9f51-4d2c-b7f1-99cd1c0b6e72	12/06 01:00 SportsCenter Última Edição PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/1dc94821-38cd-4907-9837-bd7d3f9d8273/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1760	2026-06-11 19:56:17.0312+00
311c94f5-684c-4baa-8677-365153cd82d3	12/06 01:00 Live da Madrugada - Dia 1 PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019eacc3-9095-7088-b9f7-e0502f90632e/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1761	2026-06-11 19:56:17.0312+00
47e22cc7-b0a4-41e4-9790-a34016d1adcb	20:05 11/06 - Canada v France | Week 1 | Men's VNL 2026 PPV+ [VOLEI]	https://cdn.jwplayer.com/v2/media/NA4Gcq7H/poster.jpg?width=1920	https://example.com/stream.m3u8	Geral	NBA.br	1762	2026-06-11 19:56:17.0312+00
162ba31d-46de-4f06-9e6b-da8ddbe00c66	19:35 11/06 - Brazil v Belgium | Week 1 | Men's VNL 2026 PPV+ [VOLEI]	https://cdn.jwplayer.com/v2/media/9bE98bCh/poster.jpg?width=1920	https://example.com/stream.m3u8	Geral	NBA.br	1763	2026-06-11 19:56:17.0312+00
1c111cb7-25e8-4b85-b4e3-f9ceb855ea19	19:35 11/06 -  Brasil x Bélgica | Week 1 | VNL Masculina 2026 PPV+ [VOLEI]	https://cdn.jwplayer.com/v2/media/h6Ug0D64/poster.jpg?width=1920	https://example.com/stream.m3u8	Geral	NBA.br	1764	2026-06-11 19:56:17.0312+00
ad805aa9-6620-4fcf-bda9-7aa439f5a853	16:35 11/06 - Germany v Italy | Week 1 | Men's VNL 2026 PPV+ [VOLEI]	https://cdn.jwplayer.com/v2/media/snIUKWKD/poster.jpg?width=1920	https://example.com/stream.m3u8	Geral	NBA.br	1765	2026-06-11 19:56:17.0312+00
3264a900-2d02-4618-80c5-2f28bbba58b7	16:05 11/06 - Bulgaria v Iran | Week 1 | Men's VNL 2026 PPV+ [VOLEI]	https://cdn.jwplayer.com/v2/media/nQ3gfcPU/poster.jpg?width=1920	https://example.com/stream.m3u8	Geral	NBA.br	1766	2026-06-11 19:56:17.0312+00
04a071dc-81bf-466f-a5d8-dc7159c42ec8	19:30 11/06 Mathieu vs. Falcao [DAZN]	https://image.discovery.indazn.com/ca/v3/ca/none/9473eopkaro11dioulm2bsmo5_image-header_pLa_1780668947000/fill/none/top/none/80/334/187/webp/image	https://example.com/stream.m3u8	Esportes	none	1767	2026-06-11 19:56:17.0312+00
5a27966e-1f07-45b9-b4ed-bd8215c4a111	17:00 11/06 Rodriguez vs. Vargas: Coletiva de Imprensa [DAZN]	https://image.discovery.indazn.com/ca/v3/ca/none/kp6zd08ng1n91lf6akzjesxlc_image-header_pLa_1780677708000/fill/none/top/none/80/334/187/webp/image	https://example.com/stream.m3u8	Esportes	none	1768	2026-06-11 19:56:17.0312+00
7b86719a-6811-464c-85b3-181103991ace	12/06 02:00 SportsCenter PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/5f630d83-b9c1-4438-9487-764d1df148df/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1769	2026-06-11 19:56:17.0312+00
e6a40c6e-3c9c-4850-92c4-bba78edda894	11/06 21:30 CazéTV: Coreia do Sul x República Tcheca PPV+ [CAZE]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.21b14113-e60b-425b-b684-b9d54ac2a5ca/22/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	Caze.br	1770	2026-06-11 19:56:17.0312+00
48dff9fc-f43c-4460-b20c-8314f2aac7af	11/06 18:00 CopaZona PPV+ [CAZE]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.de007b37-2c90-499f-9d13-771ca67ae140/3/BOXART-4X3/pt-BR.jpg	https://example.com/stream.m3u8	Geral	Caze.br	1771	2026-06-11 19:56:17.0312+00
2bb81225-3a92-4ab3-97e2-466a44909042	11/06 14:00 CazéTV: México x África do Sul PPV+ [CAZE]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.4400ba41-0284-4389-9a2e-07a99d8f66f4/29/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	Caze.br	1772	2026-06-11 19:56:17.0312+00
53a07d6e-250a-415b-b0ae-58daee0024f2	11/06 12:45 Aqui É Brasil PPV+ [CAZE]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.474e80dc-e45c-47c5-84f8-9fe3bf991f13/6/BOXART-4X3/pt-BR.jpg	https://example.com/stream.m3u8	Geral	Caze.br	1773	2026-06-11 19:56:17.0312+00
3e0f2dc9-e68d-40f0-bfcd-203941876a92	11/06 23:00 - COREIA DO SUL x REPÚBLICA TCHECA | GRUPO A - COPA DO MUNDO | 11/06/2026 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/zEoyYJ87vFs/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1774	2026-06-11 19:56:17.0312+00
ed0ed341-51b8-4566-93eb-d3f2390da65f	11/06 21:00 - JOGO LNF SILVER 2026 | BALSAS X AMÉRICA-RN | RODADA 09 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/zCgIcfb8jhA/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1775	2026-06-11 19:56:17.0312+00
a832dd0b-ab06-475e-a5c3-5dcdde364e45	11/06 19:45 - FIDAS FUTSAL x MINAS - COPA DO BRASIL DE FUTSAL - 04.06.26 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/TgAbvDwP_VI/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1776	2026-06-11 19:56:17.0312+00
418f7487-20b1-4728-a920-4aa447a6eea4	11/06 19:00 - JOGO LNF SILVER 2026 | SÃO CAETANO X DRACENA | RODADA 09 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/7Vah1yhy1OY/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1777	2026-06-11 19:56:17.0312+00
0410ddcf-e551-4a29-b9f9-f33b6cfc3576	11/06 19:00 - JOGO LNF SILVER 2026 | CONCÓRDIA X SPORT | RODADA 09 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/nlhQfPI-Hak/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1778	2026-06-11 19:56:17.0312+00
e1485ff0-6a13-4883-8bc3-63af5b417ad9	11/06 16:00 - MÉXICO x ÁFRICA DO SUL | GRUPO A - COPA DO MUNDO | 11/06/2026 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/LbugJbEuuKw/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1779	2026-06-11 19:56:17.0312+00
57418b2f-ffed-41c4-9617-9d2cb77394a0	11/06 14:15 - HEXA BRASIL | TUDO SOBRE A SELEÇÃO BRASILEIRA PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/zvI7kal5BWc/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1780	2026-06-11 19:56:17.0312+00
1a2230eb-d4fb-43b4-ab19-3960f2276ec1	11/06 14:00 - Pool Play - Beach Pro Tour 2026 | Alanya - Challenge | Court 2 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/9fB6BaL3RYI/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1781	2026-06-11 19:56:17.0312+00
8096a8ca-d498-4802-a8c1-5d6445617a8d	11/06 14:00 - Pool Play - Beach Pro Tour 2026 | Alanya - Challenge | Court 1 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/4uxuqIMQ9Z8/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1782	2026-06-11 19:56:17.0312+00
e9326ca8-325a-449d-94f3-4d547d28dc6a	11/06 14:00 - Pool Play - Beach Pro Tour 2026 | Alanya - Challenge | Court 4 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/1sn-vyviDyI/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1783	2026-06-11 19:56:17.0312+00
ccf1cc19-4e22-4e63-87be-20620514b4b4	11/06 14:00 - Pool Play - Beach Pro Tour 2026 | Alanya - Challenge | Court 3 PPV+ [ESTADUAIS]	https://i.ytimg.com/vi/x3xs9IJAXOQ/hqdefault.jpg	https://example.com/stream.m3u8	Geral	none	1784	2026-06-11 19:56:17.0312+00
cdd9aef6-8c21-46f9-9114-4ac30db6801d	15/06 02:00 UFC FREEDOM 250: POST-FIGHT PRESS CONFERENCE PPV+ [UFC]	https://img.dge-prod.dicelaboratory.com/original/2026/05/21194638-hrblpa3iuv7ns8wq.jpg	https://example.com/stream.m3u8	Geral	None	1785	2026-06-11 19:56:17.0312+00
ec46692f-ad0d-47ef-8d82-efc033a89788	11/06 20:40 White Sox at Braves PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.e6dd1a70-bc2f-4977-a980-c18faaa85653/5/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1786	2026-06-11 19:56:17.0312+00
c522d78b-f60c-46d7-a590-4f2ac6746204	11/06 20:05 Season 2026 PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.61e7b844-7f93-44db-85a4-f9c74f5471a3/2/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1787	2026-06-11 19:56:17.0312+00
cf271542-c0f5-4c0f-bbeb-4a1cd0592aa5	11/06 19:40 Dodgers at Pirates PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.f1d228b0-2669-4b3a-9f79-f1050350aa4f/2/BOXART-4X3/en-GB/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1788	2026-06-11 19:56:17.0312+00
8185faa9-af15-4d4a-9d33-c1e805134bde	11/06 16:10 Rockies at Cubs PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.d8ad3e97-9578-4cf9-8433-24aa454f2112/2/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1789	2026-06-11 19:56:17.0312+00
c694710c-187d-47d5-9989-0aa56e002e69	11/06 15:10 Rangers at Royals PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.4f7274cf-9c02-4ff8-991a-faca8760c66f/2/BOXART-4X3/en-GB/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1790	2026-06-11 19:56:17.0312+00
5a0b9ef2-4ab9-4784-b9a0-e5153bfc2d24	11/06 14:10 Twins at Tigers PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.ccda4523-9d1c-44aa-90a4-140ae63740c3/2/BOXART-4X3/en-GB/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1791	2026-06-11 19:56:17.0312+00
95196b8d-fdca-48bb-9c53-1aaf10715f93	11/06 14:10 Diamondbacks at Marlins PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.c2168df7-719c-4c9f-8b47-1e86fd8b1eba/2/BOXART-4X3/en-GB/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1792	2026-06-11 19:56:17.0312+00
f46660d1-e7a7-49d3-8849-44c884457615	11/06 14:10 Cardinals at Mets PPV+ [MLB]	https://m.media-amazon.com/images/S/le-target-images-prod/amzn1.dv.gti.09063b0b-6466-417e-acde-805d837533d5/5/BOXART-4X3/pt-BR/2560x1920.png	https://example.com/stream.m3u8	Geral	None	1793	2026-06-11 19:56:17.0312+00
27bbfdc7-a968-4c9d-aa83-d996413f877f	16:00 - México X África do Sul | Copa do Mundo - SINAL 1 - 11/06	https://img.ptscreens.com/Mexico_vs_Africa-do-Sul_1600.png	https://example.com/stream.m3u8	Geral	Jogosdodia.br	1794	2026-06-11 19:56:17.0312+00
68454d65-dee8-4a13-9a19-bf4733e88fab	12/06 00:00 SportsCenter PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/005414fa-7eb0-47e2-ba7c-fc2b55c1c406/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1795	2026-06-11 19:56:17.0312+00
8b04e2a3-e34b-4d51-858f-b7095e2dae6c	11/06 16:00 RBC Canadian Open: Featured Group 2 (Primeira Rodada) PPV+ [DISNEY]	https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/019e7eda-74bd-7531-93ee-dfbc89101b26/compose?format=png	https://example.com/stream.m3u8	Infantil	Disney.br	1796	2026-06-11 19:56:17.0312+00
\.


--
-- Data for Name: tv_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tv_settings (id, key, value, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-04-22 19:09:48
20211116045059	2026-04-22 19:09:48
20211116050929	2026-04-22 19:09:48
20211116051442	2026-04-22 19:09:48
20211116212300	2026-04-22 19:09:48
20211116213355	2026-04-22 19:09:48
20211116213934	2026-04-22 19:09:48
20211116214523	2026-04-22 19:09:48
20211122062447	2026-04-22 19:09:48
20211124070109	2026-04-22 19:09:48
20211202204204	2026-04-22 19:09:48
20211202204605	2026-04-22 19:09:48
20211210212804	2026-04-22 19:09:48
20211228014915	2026-04-22 19:09:48
20220107221237	2026-04-22 19:09:48
20220228202821	2026-04-22 19:09:48
20220312004840	2026-04-22 19:09:48
20220603231003	2026-04-22 19:09:48
20220603232444	2026-04-22 19:09:48
20220615214548	2026-04-22 19:09:48
20220712093339	2026-04-22 19:09:48
20220908172859	2026-04-22 19:09:48
20220916233421	2026-04-22 19:09:48
20230119133233	2026-04-22 19:09:48
20230128025114	2026-04-22 19:09:48
20230128025212	2026-04-22 19:09:48
20230227211149	2026-04-22 19:09:48
20230228184745	2026-04-22 19:09:48
20230308225145	2026-04-22 19:09:48
20230328144023	2026-04-22 19:09:48
20231018144023	2026-04-22 19:09:48
20231204144023	2026-04-22 19:09:48
20231204144024	2026-04-22 19:09:48
20231204144025	2026-04-22 19:09:48
20240108234812	2026-04-22 19:09:48
20240109165339	2026-04-22 19:09:48
20240227174441	2026-04-22 19:09:48
20240311171622	2026-04-22 19:09:48
20240321100241	2026-04-22 19:09:48
20240401105812	2026-04-22 19:09:48
20240418121054	2026-04-22 19:09:48
20240523004032	2026-04-22 19:09:48
20240618124746	2026-04-22 19:09:48
20240801235015	2026-04-22 19:09:48
20240805133720	2026-04-22 19:09:48
20240827160934	2026-04-22 19:09:48
20240919163303	2026-04-22 19:09:48
20240919163305	2026-04-22 19:09:48
20241019105805	2026-04-22 19:09:48
20241030150047	2026-04-22 19:09:48
20241108114728	2026-04-22 19:09:48
20241121104152	2026-04-22 19:09:48
20241130184212	2026-04-22 19:09:48
20241220035512	2026-04-22 19:09:48
20241220123912	2026-04-22 19:09:48
20241224161212	2026-04-22 19:09:48
20250107150512	2026-04-22 19:09:48
20250110162412	2026-04-22 19:09:48
20250123174212	2026-04-22 19:09:49
20250128220012	2026-04-22 19:09:49
20250506224012	2026-04-22 19:09:49
20250523164012	2026-04-22 19:09:49
20250714121412	2026-04-22 19:09:49
20250905041441	2026-04-22 19:09:49
20251103001201	2026-04-22 19:09:49
20251120212548	2026-04-22 19:09:49
20251120215549	2026-04-22 19:09:49
20260218120000	2026-04-22 19:09:49
20260326120000	2026-04-22 19:09:49
20260514120000	2026-06-11 18:55:10
20260527120000	2026-06-11 18:55:10
20260528120000	2026-06-11 18:55:10
20260603120000	2026-06-11 18:55:10
20260605120000	2026-07-11 17:04:30
20260606110000	2026-07-11 17:04:30
20260616120000	2026-07-11 17:04:31
20260624120000	2026-07-11 17:04:31
20260626120000	2026-07-11 17:04:31
20260706120000	2026-07-11 17:04:31
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-04-22 19:09:50.340665
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-04-22 19:09:50.346881
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-04-22 19:09:50.353114
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-04-22 19:09:50.365386
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-04-22 19:09:50.372745
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-04-22 19:09:50.375567
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-04-22 19:09:50.37899
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-04-22 19:09:50.382421
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-04-22 19:09:50.385362
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-04-22 19:09:50.388795
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-04-22 19:09:50.391872
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-04-22 19:09:50.395234
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-04-22 19:09:50.3987
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-04-22 19:09:50.402735
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-04-22 19:09:50.406098
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-04-22 19:09:50.424098
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-04-22 19:09:50.428278
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-04-22 19:09:50.432449
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-04-22 19:09:50.435457
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-04-22 19:09:50.439393
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-04-22 19:09:50.443736
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-04-22 19:09:50.448892
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-04-22 19:09:50.45852
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-04-22 19:09:50.468938
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-04-22 19:09:50.472739
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-04-22 19:09:50.475961
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-04-22 19:09:50.47959
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-04-22 19:09:50.48271
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-04-22 19:09:50.485339
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-04-22 19:09:50.488099
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-04-22 19:09:50.490806
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-04-22 19:09:50.493543
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-04-22 19:09:50.496933
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-04-22 19:09:50.499753
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-04-22 19:09:50.502416
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-04-22 19:09:50.505116
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-04-22 19:09:50.507745
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-04-22 19:09:50.51044
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-04-22 19:09:50.513957
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-04-22 19:09:50.520337
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-04-22 19:09:50.522905
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-04-22 19:09:50.525747
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-04-22 19:09:50.528338
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-04-22 19:09:50.530941
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-04-22 19:09:50.533555
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-04-22 19:09:50.536885
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-04-22 19:09:50.545539
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-04-22 19:09:50.548905
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-04-22 19:09:50.55175
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-04-22 19:09:50.566295
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-04-22 19:09:50.569684
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-04-22 19:09:50.582398
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-04-22 19:09:50.584696
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-04-22 19:09:50.593763
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-04-22 19:09:50.596921
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-04-22 19:09:50.598513
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-22 19:09:50.609487
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-22 19:09:50.613999
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-04-22 19:09:50.603937
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-06-11 18:37:18.434469
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-06-11 18:37:19.430826
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key, rollback) FROM stdin;
20260425114929	{"-- 1. Remover tabelas antigas ou vínculos incorretos\nALTER TABLE IF EXISTS public.plans DROP CONSTRAINT IF EXISTS plans_user_id_fkey;\nALTER TABLE IF EXISTS public.alerts DROP CONSTRAINT IF EXISTS alerts_user_id_fkey;\nALTER TABLE IF EXISTS public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;\nALTER TABLE IF EXISTS public.trailer_overrides DROP CONSTRAINT IF EXISTS trailer_overrides_created_by_fkey;\n\n-- 2. Alterar colunas de user_id/created_by para TEXT (compatível com NextAuth CUIDs)\nALTER TABLE public.plans ALTER COLUMN user_id TYPE text;\nALTER TABLE public.alerts ALTER COLUMN user_id TYPE text;\nALTER TABLE public.support_tickets ALTER COLUMN user_id TYPE text;\nALTER TABLE public.trailer_overrides ALTER COLUMN created_by TYPE text;\n\n-- 3. Adicionar novas constraints apontando para a tabela \\"User\\" (maiúsculo)\nALTER TABLE public.plans \n  ADD CONSTRAINT plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.\\"User\\"(id) ON DELETE CASCADE;\n\nALTER TABLE public.alerts \n  ADD CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.\\"User\\"(id) ON DELETE CASCADE;\n\nALTER TABLE public.support_tickets \n  ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.\\"User\\"(id) ON DELETE CASCADE;\n\n-- 4. Remover a tabela duplicada \\"users\\"\nDROP TABLE IF EXISTS public.users;\n"}	fix_admin_schema_to_nextauth_user	carvalho.c.c@hotmail.com	\N	\N
20260425120338	{"ALTER TABLE public.\\"User\\" \nADD COLUMN IF NOT EXISTS \\"whatsapp\\" text,\nADD COLUMN IF NOT EXISTS \\"lastPaymentAmount\\" numeric,\nADD COLUMN IF NOT EXISTS \\"lastPaymentCurrency\\" text DEFAULT 'BRL';\n"}	add_whatsapp_and_payment_info_to_user	carvalho.c.c@hotmail.com	\N	\N
20260425120909	{"CREATE TABLE IF NOT EXISTS pricing_plans (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  name text NOT NULL,\n  price text NOT NULL,\n  currency text DEFAULT 'BRL',\n  features text[] NOT NULL,\n  button_text text NOT NULL,\n  is_popular boolean DEFAULT false,\n  color_theme text DEFAULT 'blue'\n);\n\nCREATE TABLE IF NOT EXISTS site_features (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  title text NOT NULL,\n  description text NOT NULL,\n  icon_name text NOT NULL,\n  color_theme text DEFAULT 'green'\n);\n\n-- Seed with current data\nINSERT INTO pricing_plans (name, price, features, button_text, color_theme) VALUES\n('BASIC', '29,90', ARRAY['Resolução 720p', '1 Tela', 'Acesso Imediato', 'Suporte via Chat'], 'ASSINAR BASIC', 'blue'),\n('STANDARD', '49,90', ARRAY['Resolução 1080p', '2 Telas Simultâneas', 'Catálogo Completo', 'Downloads Liberados'], 'ASSINAR STANDARD', 'green'),\n('PREMIUM', '79,90', ARRAY['Resolução 4K + HDR', '4 Telas Simultâneas', 'Qualidade Máxima', 'Eventos Exclusivos'], 'ASSINAR PREMIUM', 'yellow');\n\nUPDATE pricing_plans SET is_popular = true WHERE name = 'STANDARD';\n\nINSERT INTO site_features (title, description, icon_name, color_theme) VALUES\n('Assista na TV', 'Smart TVs, Apple TV, Chromecast e muito mais direto do seu sofá.', 'Tv', 'green'),\n('No seu Celular', 'Baixe seus jogos e eventos favoritos para assistir offline onde estiver.', 'Smartphone', 'yellow'),\n('Qualquer Lugar', 'Acesse sua conta em computadores, tablets e consoles de videogame.', 'Globe', 'blue'),\n('Segurança Total', 'Controle de acesso manual garantindo a integridade da sua conta.', 'ShieldCheck', 'green');\n"}	create_landing_page_tables	carvalho.c.c@hotmail.com	\N	\N
20260425124304	{"CREATE TABLE support_requests (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  user_id TEXT REFERENCES \\"User\\"(id) ON DELETE CASCADE,\n  service_type TEXT NOT NULL,\n  description TEXT,\n  status TEXT DEFAULT 'PENDING', -- PENDING (Amarelo), COMPLETED (Verde)\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- RLS\nALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;\nCREATE POLICY \\"Users can view their own requests\\" ON support_requests FOR SELECT USING (auth.uid()::text = user_id);\nCREATE POLICY \\"Users can create requests\\" ON support_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id);\nCREATE POLICY \\"Admins can view all requests\\" ON support_requests FOR ALL USING (\n  EXISTS (SELECT 1 FROM \\"User\\" WHERE id = auth.uid()::text AND role = 'ADMIN')\n);"}	create_support_requests_table	carvalho.c.c@hotmail.com	\N	\N
20260426104538	{"ALTER TABLE \\"Watchlist\\" ADD COLUMN IF NOT EXISTS \\"metadata\\" TEXT;"}	add_metadata_to_watchlist	carvalho.c.c@hotmail.com	\N	\N
20260426105936	{"ALTER TABLE \\"support_requests\\" ADD COLUMN IF NOT EXISTS \\"admin_response\\" TEXT;\nALTER TABLE \\"support_requests\\" DROP CONSTRAINT IF EXISTS \\"support_requests_status_check\\";\n-- Note: Check if the constraint exists, usually status is a text field anyway.\n-- I'll ensure the status can handle the new values.\n"}	update_support_requests_for_chat	carvalho.c.c@hotmail.com	\N	\N
20260426110420	{"ALTER TABLE \\"support_requests\\" DISABLE ROW LEVEL SECURITY;\nGRANT ALL ON TABLE \\"support_requests\\" TO anon, authenticated, service_role;\n"}	disable_rls_on_support_requests	carvalho.c.c@hotmail.com	\N	\N
20260426110829	{"ALTER TABLE \\"support_requests\\" ADD COLUMN IF NOT EXISTS \\"messages\\" JSONB DEFAULT '[]'::jsonb;\n\n-- Opcional: Migrar a descrição inicial para o primeiro item do array de mensagens se o array estiver vazio\nUPDATE \\"support_requests\\" \nSET \\"messages\\" = jsonb_build_array(jsonb_build_object('role', 'user', 'text', \\"description\\", 'date', \\"created_at\\"))\nWHERE \\"messages\\" = '[]'::jsonb AND \\"description\\" IS NOT NULL;\n"}	add_chat_messages_to_support_requests	carvalho.c.c@hotmail.com	\N	\N
20260426111625	{"ALTER TABLE \\"User\\" \nADD COLUMN IF NOT EXISTS \\"expires_at\\" TIMESTAMP WITH TIME ZONE,\nADD COLUMN IF NOT EXISTS \\"notification_active\\" BOOLEAN DEFAULT FALSE;\n\n-- Set default expiration for existing users who don't have one (30 days from now)\nUPDATE \\"User\\" SET \\"expires_at\\" = NOW() + INTERVAL '30 days' WHERE \\"expires_at\\" IS NULL;\n"}	add_subscription_fields_to_user	carvalho.c.c@hotmail.com	\N	\N
20260426113610	{"-- Adiciona preço do plano ao usuário\nALTER TABLE \\"User\\" ADD COLUMN IF NOT EXISTS \\"plan_price\\" DECIMAL(10,2) DEFAULT 0.00;\n\n-- Cria tabela de transações (Financeiro)\nCREATE TABLE IF NOT EXISTS \\"transactions\\" (\n  \\"id\\" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  \\"type\\" TEXT NOT NULL, -- 'INCOME' (Entrada) ou 'EXPENSE' (Saída)\n  \\"category\\" TEXT NOT NULL, -- 'PLAN_RENEWAL', 'CREDITS', 'SERVER', 'OTHER'\n  \\"amount\\" DECIMAL(10,2) NOT NULL,\n  \\"description\\" TEXT,\n  \\"user_id\\" TEXT REFERENCES \\"User\\"(id),\n  \\"created_at\\" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- Habilitar RLS e desativar para facilitar desenvolvimento inicial\nALTER TABLE \\"transactions\\" ENABLE ROW LEVEL SECURITY;\nCREATE POLICY \\"Public Transactions Access\\" ON \\"transactions\\" FOR ALL USING (true) WITH CHECK (true);\n"}	finance_system_setup_v2	carvalho.c.c@hotmail.com	\N	\N
20260426114716	{"-- Adiciona campos de dispositivos e pontos ao usuário\nALTER TABLE \\"User\\" ADD COLUMN IF NOT EXISTS \\"connections\\" INTEGER DEFAULT 1;\nALTER TABLE \\"User\\" ADD COLUMN IF NOT EXISTS \\"app_name\\" TEXT DEFAULT 'SFL Stream';\nALTER TABLE \\"User\\" ADD COLUMN IF NOT EXISTS \\"device_type\\" TEXT DEFAULT 'SMART TV';\n"}	user_device_details	carvalho.c.c@hotmail.com	\N	\N
20260426120241	{"-- Adiciona campo de localidade ao usuário\nALTER TABLE \\"User\\" ADD COLUMN IF NOT EXISTS \\"location\\" TEXT DEFAULT 'Brasil';\n"}	add_user_location	carvalho.c.c@hotmail.com	\N	\N
20260428155120	{"CREATE TABLE IF NOT EXISTS public.available_apps (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  platform TEXT NOT NULL,\n  icon_url TEXT,\n  download_url TEXT NOT NULL,\n  description TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- Habilitar RLS\nALTER TABLE public.available_apps ENABLE ROW LEVEL SECURITY;\n\n-- Políticas de RLS\nCREATE POLICY \\"Apps são visíveis para todos\\" ON public.available_apps FOR SELECT USING (true);\nCREATE POLICY \\"Apenas admins podem gerenciar apps\\" ON public.available_apps \n  FOR ALL\n  TO authenticated\n  USING (\n    EXISTS (\n      SELECT 1 FROM public.\\"User\\" \n      WHERE id = auth.uid()::text \n      AND role = 'ADMIN'\n    )\n  );\n"}	create_available_apps_table_v2	carvalho.c.c@hotmail.com	\N	\N
20260428162439	{"ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL' NOT NULL;\n\n-- Atualizar descrições ou outros metadados se necessário, mas por agora o default resolve.\n"}	add_currency_to_transactions	carvalho.c.c@hotmail.com	\N	\N
20260428170755	{"-- Adicionar coluna currency na tabela transactions\nALTER TABLE public.transactions \nADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL';\n\n-- Atualizar registros existentes para INCOME baseando-se no User.lastPaymentCurrency\nUPDATE public.transactions t\nSET currency = u.\\"lastPaymentCurrency\\"\nFROM public.\\"User\\" u\nWHERE t.user_id = u.id\nAND t.type = 'INCOME';\n\n-- Garantir que EXPENSE também tenha valor padrão se não tiver\nUPDATE public.transactions \nSET currency = 'BRL' \nWHERE currency IS NULL;\n"}	add_currency_to_transactions	carvalho.c.c@hotmail.com	\N	\N
20260428173013	{"CREATE TABLE IF NOT EXISTS public.recent_uploads (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  tmdb_id TEXT NOT NULL,\n  title TEXT NOT NULL,\n  poster_path TEXT,\n  type TEXT DEFAULT 'movie',\n  release_date TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- Limpar tabela antes de novas importações (opcional, ou podemos manter um histórico)\n-- Para este caso, vamos permitir deletar tudo e reinserir para \\"limpar\\" a grade se o admin quiser.\n\nALTER TABLE public.recent_uploads ENABLE ROW LEVEL SECURITY;\nCREATE POLICY \\"Recent uploads visíveis para todos\\" ON public.recent_uploads FOR SELECT USING (true);\nCREATE POLICY \\"Admins gerenciam recent uploads\\" ON public.recent_uploads FOR ALL USING (\n  EXISTS (SELECT 1 FROM public.\\"User\\" WHERE id = auth.uid()::text AND role = 'ADMIN')\n);\n"}	create_recent_uploads_table	carvalho.c.c@hotmail.com	\N	\N
20260428174349	{"CREATE TABLE IF NOT EXISTS public.recent_catalog_updates (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  raw_text TEXT NOT NULL,\n  parsed_titles TEXT[] NOT NULL,\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- Habilitar RLS\nALTER TABLE public.recent_catalog_updates ENABLE ROW LEVEL SECURITY;\n\n-- Políticas de RLS\nCREATE POLICY \\"Atualizações visíveis para todos\\" ON public.recent_catalog_updates FOR SELECT USING (true);\nCREATE POLICY \\"Apenas admins gerenciam catálogo\\" ON public.recent_catalog_updates \n  FOR ALL\n  TO authenticated\n  USING (\n    EXISTS (\n      SELECT 1 FROM public.\\"User\\" \n      WHERE id = auth.uid()::text \n      AND role = 'ADMIN'\n    )\n  );\n\n-- Inserir registro inicial se não existir\nINSERT INTO public.recent_catalog_updates (raw_text, parsed_titles)\nVALUES ('- Exemplo Filme (2025)', ARRAY['Exemplo Filme'])\nON CONFLICT DO NOTHING;\n"}	create_recent_catalog_updates_table	carvalho.c.c@hotmail.com	\N	\N
20260428193746	{"CREATE TABLE IF NOT EXISTS public.tv_channels (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  logo_url TEXT,\n  stream_url TEXT NOT NULL,\n  category TEXT DEFAULT 'Geral',\n  epg_channel_id TEXT,\n  number INTEGER,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS public.tv_settings (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  key TEXT UNIQUE NOT NULL,\n  value JSONB,\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- RLS\nALTER TABLE public.tv_channels ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.tv_settings ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \\"Canais visíveis para todos\\" ON public.tv_channels FOR SELECT USING (true);\nCREATE POLICY \\"Admins gerenciam canais\\" ON public.tv_channels FOR ALL TO authenticated USING (\n  EXISTS (SELECT 1 FROM public.\\"User\\" WHERE id = auth.uid()::text AND role = 'ADMIN')\n);\n\nCREATE POLICY \\"Settings visíveis para todos\\" ON public.tv_settings FOR SELECT USING (true);\nCREATE POLICY \\"Admins gerenciam settings\\" ON public.tv_settings FOR ALL TO authenticated USING (\n  EXISTS (SELECT 1 FROM public.\\"User\\" WHERE id = auth.uid()::text AND role = 'ADMIN')\n);\n\n-- Inserir alguns canais de exemplo (podem ser alterados pelo admin depois)\nINSERT INTO public.tv_channels (name, logo_url, stream_url, category, epg_channel_id)\nVALUES \n('Globo RJ', 'https://i.imgur.com/example.png', 'https://example.com/globo.m3u8', 'Abertos', 'Globo.br'),\n('SporTV', 'https://i.imgur.com/example.png', 'https://example.com/sportv.m3u8', 'Esportes', 'SporTV.br')\nON CONFLICT DO NOTHING;\n"}	create_tv_module_tables	carvalho.c.c@hotmail.com	\N	\N
20260429210411	{"-- Tabela para configurações globais do sistema\nCREATE TABLE IF NOT EXISTS system_settings (\n    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    key TEXT UNIQUE NOT NULL,\n    value TEXT NOT NULL,\n    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())\n);\n\n-- Inserir a URL do EPG padrão enviada por você\nINSERT INTO system_settings (key, value) \nVALUES ('epg_url', 'https://epgshare01.online/epgshare01/epg_ripper_ALL_SOURCES1.xml.gz')\nON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;\n"}	add_epg_settings	carvalho.c.c@hotmail.com	\N	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict NIUuggsaXnpQR6kehhdgan7QReYza0G0CG5VNGMTN4JFD5YkMw9xfOUNawWmRlQ

