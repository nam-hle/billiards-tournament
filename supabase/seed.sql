SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tournaments" ("id", "name", "year", "venue", "image", "description", "start_time", "end_time", "map_url") VALUES
	('2024', 'Tournament 2024', '2024', 'The Billiards Club - 37 Pasteur, Danang', '/tournament-2024.jpg', 'The starting point of a story written in focus and finesse—mgm’s first-ever billiards tournament', '2024-08-10 01:30:00+00', '2024-08-25 05:00:00+00', 'https://maps.app.goo.gl/mePmTAgDTC865gdP7'),
	('2025', 'Tournament 2025', '2025', 'The Billiards Club - 37 Pasteur, Danang', '/tournament-2025.jpg', 'Stronger. Bolder. Bigger. The second chapter of mgm’s billiards tradition returns with rising talents', '2025-08-03 01:30:00+00', '2025-08-24 05:00:00+00', 'https://maps.app.goo.gl/mePmTAgDTC865gdP7');


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."groups" ("id", "name", "tournament_id") VALUES
	('a6c77c93-4636-477a-b5b4-00ed559a924e', 'A', '2024'),
	('70f52404-8ccf-4ad7-b94c-9f029a4f0e01', 'B', '2024'),
	('f9f6889a-c052-46f7-b498-2ad780fac770', 'C', '2024'),
	('af349b81-7cbe-482a-99a8-066f8f0e82ed', 'D', '2024'),
	('8808dca7-ab9f-4871-b315-2fbd145f4b2b', 'A', '2025'),
	('be8fa313-b24e-4450-841b-d47420aeb726', 'B', '2025'),
	('ca867865-48a1-458b-9cb9-b43343e0da3b', 'C', '2025');


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."players" ("id", "name", "nickname") VALUES
	('nhle', 'Nam Hoang Le', 'The Breaker'),
	('bvphan', 'Binh Van Phan', 'Spin Master'),
	('tttran', 'Tuyen Trung Tran', 'Silent Cue'),
	('atvo', 'An Tien Vo', 'The Sharp Shooter'),
	('bvqhuynh', 'Binh Van Quoc Huynh', 'Ice Man'),
	('dple', 'Duy Phi Le', 'Smooth Stroke'),
	('hnnguyen', 'Hung Ngoc Nguyen', 'The Tactician'),
	('hqnguyen', 'Hieu Quang Nguyen', 'The Precisionist'),
	('hqtran', 'Huy Quang Tran', 'Rack Reaper'),
	('ltnguyen', 'Liem Thanh Nguyen', 'Cue Master'),
	('mbnguyen', 'Minh Binh Nguyen', 'Rack Slayer'),
	('qanguyen', 'Quoc Anh Nguyen', 'Angle Artist'),
	('shvu', 'Son Hoang Vu', 'The Dominator'),
	('thnguyen', 'Thien Hoang Nguyen', 'Cue Terminator'),
	('tmdo', 'Tuan Minh Do', 'Pocket Predator'),
	('lvluu', 'Loi Van Luu', 'The Dominator'),
	('dxnguyen', 'Dung Xuan Nguyen', 'Ice Veins'),
	('lhpham', 'Long Hoang Pham', NULL),
	('benvphan', 'Ben Van Phan', NULL),
	('ewilton', 'Eric Wilton', NULL),
	('dqtrinh', 'Duy Quang Trinh', NULL),
	('tuanttran', 'Tuan Thanh Tran', NULL);


--
-- Data for Name: group_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."group_players" ("player_id", "group_id") VALUES
	('tmdo', 'a6c77c93-4636-477a-b5b4-00ed559a924e'),
	('hqtran', 'a6c77c93-4636-477a-b5b4-00ed559a924e'),
	('lvluu', 'a6c77c93-4636-477a-b5b4-00ed559a924e'),
	('hnnguyen', 'a6c77c93-4636-477a-b5b4-00ed559a924e'),
	('bvqhuynh', 'a6c77c93-4636-477a-b5b4-00ed559a924e'),
	('tttran', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01'),
	('dxnguyen', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01'),
	('ewilton', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01'),
	('benvphan', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01'),
	('mbnguyen', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01'),
	('bvphan', 'f9f6889a-c052-46f7-b498-2ad780fac770'),
	('hqnguyen', 'f9f6889a-c052-46f7-b498-2ad780fac770'),
	('thnguyen', 'f9f6889a-c052-46f7-b498-2ad780fac770'),
	('atvo', 'f9f6889a-c052-46f7-b498-2ad780fac770'),
	('lhpham', 'f9f6889a-c052-46f7-b498-2ad780fac770'),
	('nhle', 'af349b81-7cbe-482a-99a8-066f8f0e82ed'),
	('ltnguyen', 'af349b81-7cbe-482a-99a8-066f8f0e82ed'),
	('tuanttran', 'af349b81-7cbe-482a-99a8-066f8f0e82ed'),
	('shvu', 'af349b81-7cbe-482a-99a8-066f8f0e82ed'),
	('dqtrinh', 'af349b81-7cbe-482a-99a8-066f8f0e82ed'),
	('nhle', '8808dca7-ab9f-4871-b315-2fbd145f4b2b'),
	('hqtran', '8808dca7-ab9f-4871-b315-2fbd145f4b2b'),
	('atvo', '8808dca7-ab9f-4871-b315-2fbd145f4b2b'),
	('dple', '8808dca7-ab9f-4871-b315-2fbd145f4b2b'),
	('hqnguyen', '8808dca7-ab9f-4871-b315-2fbd145f4b2b'),
	('bvphan', 'be8fa313-b24e-4450-841b-d47420aeb726'),
	('tmdo', 'be8fa313-b24e-4450-841b-d47420aeb726'),
	('qanguyen', 'be8fa313-b24e-4450-841b-d47420aeb726'),
	('hnnguyen', 'be8fa313-b24e-4450-841b-d47420aeb726'),
	('mbnguyen', 'be8fa313-b24e-4450-841b-d47420aeb726'),
	('tttran', 'ca867865-48a1-458b-9cb9-b43343e0da3b'),
	('bvqhuynh', 'ca867865-48a1-458b-9cb9-b43343e0da3b'),
	('shvu', 'ca867865-48a1-458b-9cb9-b43343e0da3b'),
	('thnguyen', 'ca867865-48a1-458b-9cb9-b43343e0da3b'),
	('ltnguyen', 'ca867865-48a1-458b-9cb9-b43343e0da3b');


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."matches" ("id", "tournament_id", "type", "player_id_1", "player_id_2", "score_1", "score_2", "placeholder_1", "placeholder_2", "scheduled_at", "group_id", "order") VALUES
	('0', '2024', 'group', 'tmdo', 'hqtran', 2, 5, NULL, NULL, '2024-08-10 02:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('1', '2024', 'group', 'tmdo', 'lvluu', 5, 4, NULL, NULL, '2024-08-14 05:15:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('2', '2024', 'group', 'tmdo', 'hnnguyen', 5, 2, NULL, NULL, '2024-08-13 05:15:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('3', '2024', 'group', 'tmdo', 'bvqhuynh', 5, 0, NULL, NULL, '2024-08-10 01:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('4', '2024', 'group', 'hqtran', 'lvluu', 3, 5, NULL, NULL, '2024-08-10 01:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('5', '2024', 'group', 'hqtran', 'hnnguyen', 5, 1, NULL, NULL, '2024-08-11 03:45:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('6', '2024', 'group', 'hqtran', 'bvqhuynh', 3, 5, NULL, NULL, '2024-08-11 02:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('7', '2024', 'group', 'lvluu', 'hnnguyen', 2, 5, NULL, NULL, '2024-08-11 02:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('8', '2024', 'group', 'lvluu', 'bvqhuynh', 5, 3, NULL, NULL, '2024-08-11 01:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('9', '2024', 'group', 'hnnguyen', 'bvqhuynh', 5, 3, NULL, NULL, '2024-08-13 01:30:00+00', 'a6c77c93-4636-477a-b5b4-00ed559a924e', NULL),
	('10', '2024', 'group', 'tttran', 'dxnguyen', 5, 1, NULL, NULL, '2024-08-10 01:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('11', '2024', 'group', 'tttran', 'ewilton', 5, 4, NULL, NULL, '2024-08-13 05:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('12', '2024', 'group', 'tttran', 'benvphan', 5, 0, NULL, NULL, '2024-08-10 02:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('13', '2024', 'group', 'tttran', 'mbnguyen', 5, 0, NULL, NULL, '2024-08-18 01:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('14', '2024', 'group', 'dxnguyen', 'ewilton', 5, 0, NULL, NULL, '2024-08-15 05:15:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('15', '2024', 'group', 'dxnguyen', 'benvphan', 5, 2, NULL, NULL, '2024-08-11 01:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('16', '2024', 'group', 'dxnguyen', 'mbnguyen', 5, 1, NULL, NULL, '2024-08-18 02:30:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('17', '2024', 'group', 'ewilton', 'benvphan', 5, 4, NULL, NULL, '2024-08-19 05:15:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('18', '2024', 'group', 'ewilton', 'mbnguyen', 5, 0, NULL, NULL, '2024-08-12 05:00:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('19', '2024', 'group', 'benvphan', 'mbnguyen', 5, 4, NULL, NULL, '2024-08-13 06:00:00+00', '70f52404-8ccf-4ad7-b94c-9f029a4f0e01', NULL),
	('20', '2024', 'group', 'bvphan', 'hqnguyen', 5, 2, NULL, NULL, '2024-08-22 05:15:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('21', '2024', 'group', 'bvphan', 'thnguyen', 5, 1, NULL, NULL, '2024-08-21 05:00:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('22', '2024', 'group', 'bvphan', 'atvo', 5, 4, NULL, NULL, '2024-08-20 05:15:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('23', '2024', 'group', 'bvphan', 'lhpham', 5, 3, NULL, NULL, '2024-08-10 05:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('24', '2024', 'group', 'hqnguyen', 'thnguyen', 5, 1, NULL, NULL, '2024-08-10 02:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('25', '2024', 'group', 'hqnguyen', 'atvo', 5, 1, NULL, NULL, '2024-08-10 01:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('26', '2024', 'group', 'hqnguyen', 'lhpham', 5, 0, NULL, NULL, '2024-08-10 03:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('27', '2024', 'group', 'thnguyen', 'atvo', 5, 3, NULL, NULL, '2024-08-12 05:00:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('28', '2024', 'group', 'thnguyen', 'lhpham', 5, 0, NULL, NULL, '2024-08-10 01:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('29', '2024', 'group', 'atvo', 'lhpham', 5, 0, NULL, NULL, '2024-08-10 02:30:00+00', 'f9f6889a-c052-46f7-b498-2ad780fac770', NULL),
	('30', '2024', 'group', 'nhle', 'ltnguyen', 5, 2, NULL, NULL, '2024-08-13 05:15:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('31', '2024', 'group', 'nhle', 'tuanttran', 5, 4, NULL, NULL, '2024-08-14 05:15:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('32', '2024', 'group', 'nhle', 'shvu', 5, 4, NULL, NULL, '2024-08-10 02:30:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('33', '2024', 'group', 'nhle', 'dqtrinh', 5, 0, NULL, NULL, '2024-08-13 05:15:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('34', '2024', 'group', 'ltnguyen', 'tuanttran', 5, 1, NULL, NULL, '2024-08-10 01:30:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('35', '2024', 'group', 'ltnguyen', 'shvu', 5, 2, NULL, NULL, '2024-08-11 01:30:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('36', '2024', 'group', 'ltnguyen', 'dqtrinh', 5, 0, NULL, NULL, '2024-08-13 11:00:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('37', '2024', 'group', 'tuanttran', 'shvu', 5, 0, NULL, NULL, '2024-08-15 05:00:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('38', '2024', 'group', 'tuanttran', 'dqtrinh', 2, 5, NULL, NULL, '2024-08-22 01:30:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('39', '2024', 'group', 'shvu', 'dqtrinh', 5, 4, NULL, NULL, '2024-08-21 11:15:00+00', 'af349b81-7cbe-482a-99a8-066f8f0e82ed', NULL),
	('40', '2024', 'quarter-final', 'tmdo', 'dxnguyen', 7, 4, NULL, NULL, '2024-08-24 01:30:00+00', NULL, NULL),
	('41', '2024', 'quarter-final', 'bvphan', 'ltnguyen', 7, 5, NULL, NULL, '2024-08-24 01:30:00+00', NULL, NULL),
	('42', '2024', 'quarter-final', 'hqtran', 'tttran', 2, 7, NULL, NULL, '2024-08-24 01:30:00+00', NULL, NULL),
	('43', '2024', 'quarter-final', 'hqnguyen', 'nhle', 2, 7, NULL, NULL, '2024-08-24 01:30:00+00', NULL, NULL),
	('44', '2024', 'semi-final', 'tmdo', 'bvphan', 6, 9, NULL, NULL, '2024-08-24 03:00:00+00', NULL, NULL),
	('45', '2024', 'semi-final', 'tttran', 'nhle', 6, 9, NULL, NULL, '2024-08-24 03:00:00+00', NULL, NULL),
	('46', '2024', 'final', 'nhle', 'bvphan', 11, 5, NULL, NULL, '2024-08-25 08:00:00+00', NULL, NULL),
	('47', '2025', 'group', 'nhle', 'hqtran', 5, 0, NULL, NULL, '2025-08-04 05:00:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('48', '2025', 'group', 'atvo', 'nhle', 0, 5, NULL, NULL, '2025-08-06 05:15:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('49', '2025', 'group', 'nhle', 'dple', 5, 0, NULL, NULL, '2025-08-03 01:45:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('50', '2025', 'group', 'hqnguyen', 'nhle', 5, 0, NULL, NULL, '2025-08-05 11:15:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('51', '2025', 'group', 'hqtran', 'atvo', 1, 5, NULL, NULL, '2025-08-05 05:15:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('52', '2025', 'group', 'dple', 'hqtran', 0, 5, NULL, NULL, '2025-08-07 05:15:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('53', '2025', 'group', 'hqtran', 'hqnguyen', NULL, NULL, NULL, NULL, NULL, '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('54', '2025', 'group', 'atvo', 'dple', NULL, NULL, NULL, NULL, '2025-08-09 02:00:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('55', '2025', 'group', 'hqnguyen', 'atvo', 5, 0, NULL, NULL, '2025-08-04 05:15:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('56', '2025', 'group', 'dple', 'hqnguyen', 2, 5, NULL, NULL, '2025-08-03 02:30:00+00', '8808dca7-ab9f-4871-b315-2fbd145f4b2b', NULL),
	('57', '2025', 'group', 'bvphan', 'tmdo', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('58', '2025', 'group', 'qanguyen', 'bvphan', 5, 3, NULL, NULL, '2025-08-03 01:45:00+00', 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('59', '2025', 'group', 'bvphan', 'hnnguyen', 5, 1, NULL, NULL, '2025-08-05 05:15:00+00', 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('60', '2025', 'group', 'mbnguyen', 'bvphan', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('61', '2025', 'group', 'tmdo', 'qanguyen', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('62', '2025', 'group', 'hnnguyen', 'tmdo', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('63', '2025', 'group', 'tmdo', 'mbnguyen', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('64', '2025', 'group', 'qanguyen', 'hnnguyen', 5, 0, NULL, NULL, '2025-08-06 05:15:00+00', 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('65', '2025', 'group', 'mbnguyen', 'qanguyen', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('66', '2025', 'group', 'hnnguyen', 'mbnguyen', NULL, NULL, NULL, NULL, NULL, 'be8fa313-b24e-4450-841b-d47420aeb726', NULL),
	('67', '2025', 'group', 'tttran', 'bvqhuynh', 5, 0, NULL, NULL, '2025-08-05 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('68', '2025', 'group', 'shvu', 'tttran', 1, 5, NULL, NULL, '2025-08-04 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('69', '2025', 'group', 'tttran', 'thnguyen', 5, 1, NULL, NULL, '2025-08-03 01:45:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('70', '2025', 'group', 'ltnguyen', 'tttran', NULL, NULL, NULL, NULL, '2025-08-08 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('71', '2025', 'group', 'bvqhuynh', 'shvu', NULL, NULL, NULL, NULL, '2025-08-09 02:00:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('72', '2025', 'group', 'thnguyen', 'bvqhuynh', 5, 1, NULL, NULL, '2025-08-07 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('73', '2025', 'group', 'bvqhuynh', 'ltnguyen', NULL, NULL, NULL, NULL, '2025-08-09 03:30:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('74', '2025', 'group', 'shvu', 'thnguyen', NULL, NULL, NULL, NULL, '2025-08-08 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('75', '2025', 'group', 'ltnguyen', 'shvu', 5, 1, NULL, NULL, '2025-08-07 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('76', '2025', 'group', 'thnguyen', 'ltnguyen', 5, 4, NULL, NULL, '2025-08-06 05:15:00+00', 'ca867865-48a1-458b-9cb9-b43343e0da3b', NULL),
	('77', '2025', 'quarter-final', NULL, NULL, NULL, NULL, '#1 of the quarter-finalists', '#8 of the quarter-finalists', '2025-08-17 01:30:00+00', NULL, NULL),
	('78', '2025', 'quarter-final', NULL, NULL, NULL, NULL, '#3 of the quarter-finalists', '#6 of the quarter-finalists', '2025-08-17 01:30:00+00', NULL, NULL),
	('79', '2025', 'quarter-final', NULL, NULL, NULL, NULL, '#2 of the quarter-finalists', '#7 of the quarter-finalists', '2025-08-17 01:30:00+00', NULL, NULL),
	('80', '2025', 'quarter-final', NULL, NULL, NULL, NULL, '#4 of the quarter-finalists', '#5 of the quarter-finalists', '2025-08-17 01:30:00+00', NULL, NULL),
	('81', '2025', 'semi-final', NULL, NULL, NULL, NULL, 'The winner of match #77', 'The winner of match #78', '2025-08-17 03:00:00+00', NULL, NULL),
	('82', '2025', 'semi-final', NULL, NULL, NULL, NULL, 'The winner of match #79', 'The winner of match #80', '2025-08-17 03:00:00+00', NULL, NULL),
	('83', '2025', 'final', NULL, NULL, NULL, NULL, 'The winner of match #81', 'The winner of match #82', '2025-08-24 01:30:00+00', NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
