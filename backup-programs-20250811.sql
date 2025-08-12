PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('3a55cba8-6288-46c2-9e2a-2d127b060141','ba28e0fb5bde245ad58c17a5ac6042de242b4e90d0c038465de5d2373c898be8',1754971358558,'20250812040238_init',NULL,NULL,1754971358557,1);
CREATE TABLE IF NOT EXISTS "programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "linkText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO programs VALUES('afis-summer-camp-2025','Summer Camp 2025','Al-Faruq Summer Camp – Registration Now Open! Get ready for a summer full of learning, fun, and unforgettable memories. Our program includes engaging courses in Qur''an, Arabic, Islamic Studies, Language Arts, and Math—alongside exciting activities like sports, games, and field trips.','/AFIS.SummerCamp.2025.jpeg','https://docs.google.com/forms/d/e/1FAIpQLSc6U1ur8QSSrfBBO-Ws7BxCBOCMh4RU_hwN7bvF9RfObB_xhg/viewform','Register','ACTIVE',1,1754870400000,1754870400000);
INSERT INTO programs VALUES('islamic-school-amana-academy','Al-Faruq Islamic School & Amana Academy','Safeguard Your Child''s Future with Al-Faruq Islamic School & Amana Academy. Alberta Education Accredited school for KG to Grade 9. Limited-Time Tuition Offer for the first 100 students!','/AlFaruqIslamicSchoolAndAmanaAcademy.April2025.1.jpeg','https://docs.google.com/forms/d/e/1FAIpQLScBGnya-MWf-d39tWtyDQNgEP_2Ft_86aslmSndZAY2BfRqwg/viewform','Register','ACTIVE',2,1754870400000,1754870400000);
INSERT INTO programs VALUES('weekend-quran-school','Weekend Quran School','Al-Faruq Weekend Quran School for ages 5 to 12 years. Saturday and Sunday, 11:00 AM - 02:00 PM. Invest in your Child''s Here and Hereafter. Teaching how to read Arabic fluently, Quran Recitation and Memorization, Adhkar, Sheeran and Islamic Studies.','/AlFaruq.Weekend.Quran.School.March2025.jpeg','https://docs.google.com/forms/d/e/1FAIpQLScV2xkunYsiua7s9srJdhPGaMFQDN4JN_nRWwK8nYGEnDd5kw/viewform','Register','ACTIVE',3,1754870400000,1754870400000);
INSERT INTO programs VALUES('classical-arabic-program','Classical Arabic Program','Learn Classical Arabic with our comprehensive program designed to help students master the Arabic language for better understanding of Islamic texts and Quran.','/AlFaruq.ClassicalArabicProgram.jpeg',NULL,NULL,'ACTIVE',4,1754870400000,1754870400000);
COMMIT;
