-- ============================================================
-- Seed Script: 10 Workers + Attendance + Advances
-- Run this AFTER schema.sql and AFTER registering your first user
-- ============================================================

-- Step 1: Get your user ID (run this first, copy the id)
-- SELECT id FROM auth.users LIMIT 1;

-- Step 2: Replace the UUID below with YOUR user id from Step 1
DO $$
DECLARE
    uid uuid := (SELECT id FROM auth.users LIMIT 1);
    w1 uuid; w2 uuid; w3 uuid; w4 uuid; w5 uuid;
    w6 uuid; w7 uuid; w8 uuid; w9 uuid; w10 uuid;
BEGIN

-- Insert 10 workers
INSERT INTO workers (id, user_id, name, phone, work_type, daily_wage, status, joined_at, avatar_initials)
VALUES
    (gen_random_uuid(), uid, 'Rajesh Kumar',    '9876543210', 'Mason',       800,  'Active',   '2024-06-15', 'RK'),
    (gen_random_uuid(), uid, 'Suresh Patel',    '9876543211', 'Carpenter',   750,  'Active',   '2024-07-01', 'SP'),
    (gen_random_uuid(), uid, 'Amit Singh',      '9876543212', 'Electrician', 900,  'Active',   '2024-05-20', 'AS'),
    (gen_random_uuid(), uid, 'Vikram Yadav',    '9876543213', 'Plumber',     850,  'Active',   '2024-08-10', 'VY'),
    (gen_random_uuid(), uid, 'Mahesh Sharma',   '9876543214', 'Helper',      500,  'Active',   '2024-09-01', 'MS'),
    (gen_random_uuid(), uid, 'Deepak Verma',    '9876543215', 'Painter',     700,  'Active',   '2024-04-15', 'DV'),
    (gen_random_uuid(), uid, 'Ramesh Gupta',    '9876543216', 'Mason',       820,  'Active',   '2024-03-20', 'RG'),
    (gen_random_uuid(), uid, 'Sanjay Mishra',   '9876543217', 'Carpenter',   780,  'Inactive', '2024-02-10', 'SM'),
    (gen_random_uuid(), uid, 'Pradeep Tiwari',  '9876543218', 'Electrician', 950,  'Active',   '2024-07-25', 'PT'),
    (gen_random_uuid(), uid, 'Anil Chauhan',    '9876543219', 'Helper',      550,  'Active',   '2024-10-01', 'AC');

-- Get worker IDs for seeding attendance and advances
SELECT id INTO w1 FROM workers WHERE user_id = uid AND name = 'Rajesh Kumar';
SELECT id INTO w2 FROM workers WHERE user_id = uid AND name = 'Suresh Patel';
SELECT id INTO w3 FROM workers WHERE user_id = uid AND name = 'Amit Singh';
SELECT id INTO w4 FROM workers WHERE user_id = uid AND name = 'Vikram Yadav';
SELECT id INTO w5 FROM workers WHERE user_id = uid AND name = 'Mahesh Sharma';
SELECT id INTO w6 FROM workers WHERE user_id = uid AND name = 'Deepak Verma';
SELECT id INTO w7 FROM workers WHERE user_id = uid AND name = 'Ramesh Gupta';
SELECT id INTO w8 FROM workers WHERE user_id = uid AND name = 'Sanjay Mishra';
SELECT id INTO w9 FROM workers WHERE user_id = uid AND name = 'Pradeep Tiwari';
SELECT id INTO w10 FROM workers WHERE user_id = uid AND name = 'Anil Chauhan';

-- Seed attendance for February 2026 (first 5 workers, ~20 days each)
INSERT INTO attendance (worker_id, date, status, hours_worked, earned_amount) VALUES
    -- Rajesh Kumar (Mason, ₹800/day)
    (w1, '2026-02-02', 'Present',  8, 800), (w1, '2026-02-03', 'Present',  8, 800),
    (w1, '2026-02-04', 'Present',  8, 800), (w1, '2026-02-05', 'Half-Day', 4, 400),
    (w1, '2026-02-06', 'Present',  8, 800), (w1, '2026-02-09', 'Present',  8, 800),
    (w1, '2026-02-10', 'Present',  8, 800), (w1, '2026-02-11', 'Absent',   0, 0),
    (w1, '2026-02-12', 'Present',  8, 800), (w1, '2026-02-13', 'Present',  8, 800),
    (w1, '2026-02-16', 'Present',  8, 800), (w1, '2026-02-17', 'Present',  8, 800),
    (w1, '2026-02-18', 'Half-Day', 4, 400), (w1, '2026-02-19', 'Present',  8, 800),
    (w1, '2026-02-20', 'Present',  8, 800), (w1, '2026-02-23', 'Present',  8, 800),
    (w1, '2026-02-24', 'Present',  8, 800), (w1, '2026-02-25', 'Present',  8, 800),
    -- Suresh Patel (Carpenter, ₹750/day)
    (w2, '2026-02-02', 'Present',  8, 750), (w2, '2026-02-03', 'Present',  8, 750),
    (w2, '2026-02-04', 'Absent',   0, 0),   (w2, '2026-02-05', 'Present',  8, 750),
    (w2, '2026-02-06', 'Present',  8, 750), (w2, '2026-02-09', 'Present',  8, 750),
    (w2, '2026-02-10', 'Half-Day', 4, 375), (w2, '2026-02-11', 'Present',  8, 750),
    (w2, '2026-02-12', 'Present',  8, 750), (w2, '2026-02-13', 'Present',  8, 750),
    (w2, '2026-02-16', 'Present',  8, 750), (w2, '2026-02-17', 'Absent',   0, 0),
    (w2, '2026-02-18', 'Present',  8, 750), (w2, '2026-02-19', 'Present',  8, 750),
    (w2, '2026-02-20', 'Present',  8, 750), (w2, '2026-02-23', 'Present',  8, 750),
    (w2, '2026-02-24', 'Present',  8, 750), (w2, '2026-02-25', 'Half-Day', 4, 375),
    -- Amit Singh (Electrician, ₹900/day)
    (w3, '2026-02-02', 'Present',  8, 900), (w3, '2026-02-03', 'Present',  8, 900),
    (w3, '2026-02-04', 'Present',  8, 900), (w3, '2026-02-05', 'Present',  8, 900),
    (w3, '2026-02-06', 'Half-Day', 4, 450), (w3, '2026-02-09', 'Present',  8, 900),
    (w3, '2026-02-10', 'Present',  8, 900), (w3, '2026-02-11', 'Present',  8, 900),
    (w3, '2026-02-12', 'Absent',   0, 0),   (w3, '2026-02-13', 'Present',  8, 900),
    (w3, '2026-02-16', 'Present',  8, 900), (w3, '2026-02-17', 'Present',  8, 900),
    (w3, '2026-02-18', 'Present',  8, 900), (w3, '2026-02-19', 'Present',  8, 900),
    (w3, '2026-02-20', 'Present',  8, 900), (w3, '2026-02-23', 'Present',  8, 900),
    -- Vikram Yadav (Plumber, ₹850/day)
    (w4, '2026-02-02', 'Present',  8, 850), (w4, '2026-02-03', 'Absent',   0, 0),
    (w4, '2026-02-04', 'Present',  8, 850), (w4, '2026-02-05', 'Present',  8, 850),
    (w4, '2026-02-06', 'Present',  8, 850), (w4, '2026-02-09', 'Present',  8, 850),
    (w4, '2026-02-10', 'Present',  8, 850), (w4, '2026-02-11', 'Half-Day', 4, 425),
    (w4, '2026-02-12', 'Present',  8, 850), (w4, '2026-02-13', 'Present',  8, 850),
    (w4, '2026-02-16', 'Present',  8, 850), (w4, '2026-02-17', 'Present',  8, 850),
    (w4, '2026-02-18', 'Present',  8, 850), (w4, '2026-02-19', 'Present',  8, 850),
    -- Mahesh Sharma (Helper, ₹500/day)
    (w5, '2026-02-02', 'Present',  8, 500), (w5, '2026-02-03', 'Present',  8, 500),
    (w5, '2026-02-04', 'Present',  8, 500), (w5, '2026-02-05', 'Absent',   0, 0),
    (w5, '2026-02-06', 'Present',  8, 500), (w5, '2026-02-09', 'Present',  8, 500),
    (w5, '2026-02-10', 'Present',  8, 500), (w5, '2026-02-11', 'Present',  8, 500),
    (w5, '2026-02-12', 'Half-Day', 4, 250), (w5, '2026-02-13', 'Present',  8, 500),
    (w5, '2026-02-16', 'Present',  8, 500), (w5, '2026-02-17', 'Present',  8, 500),
    (w5, '2026-02-18', 'Present',  8, 500), (w5, '2026-02-19', 'Present',  8, 500),
    (w5, '2026-02-20', 'Absent',   0, 0),   (w5, '2026-02-23', 'Present',  8, 500);

-- Seed advance payments
INSERT INTO advances (worker_id, amount, date, note, status) VALUES
    (w1, 2000, '2026-02-05', 'Festival advance',       'Pending'),
    (w1, 1500, '2026-02-15', 'Medical emergency',      'Pending'),
    (w2, 3000, '2026-02-10', 'House rent advance',     'Pending'),
    (w3, 1000, '2026-02-08', 'Travel expenses',        'Deducted'),
    (w4, 2500, '2026-02-12', 'Family emergency',       'Pending'),
    (w5, 1000, '2026-02-06', 'School fees advance',    'Deducted'),
    (w6, 1500, '2026-02-14', 'Personal loan',          'Pending'),
    (w7, 2000, '2026-02-18', 'Vehicle repair',         'Pending'),
    (w9, 3500, '2026-02-20', 'Wedding advance',        'Pending'),
    (w10, 800, '2026-02-03', 'Medicine purchase',      'Deducted');

-- Insert default settings for the user
INSERT INTO settings (user_id, company_name, contractor_name, contact_number, currency, currency_symbol)
VALUES (uid, 'BuildRight Constructions', 'Rajendra Mehta', '9876543210', 'INR', '₹')
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    contractor_name = EXCLUDED.contractor_name;

RAISE NOTICE 'Seeded 10 workers, attendance records, advances, and settings for user %', uid;

END $$;
