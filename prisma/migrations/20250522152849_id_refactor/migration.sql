/*
  Warnings:

  - The primary key for the `Agency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Agency` table. All the data in the column will be lost.
  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[detail]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "spaceId" INTEGER NOT NULL,
    CONSTRAINT "Address_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "country", "id", "latitude", "longitude", "number", "spaceId", "street", "zip") SELECT "city", "country", "id", "latitude", "longitude", "number", "spaceId", "street", "zip" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_spaceId_key" ON "Address"("spaceId");
CREATE TABLE "new_Agency" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    CONSTRAINT "Agency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Agency" ("name", "telephone", "vatNumber") SELECT "name", "telephone", "vatNumber" FROM "Agency";
DROP TABLE "Agency";
ALTER TABLE "new_Agency" RENAME TO "Agency";
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" TEXT NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "bookingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingDate", "clientId", "createdAt", "id", "spaceId") SELECT "bookingDate", "clientId", "createdAt", "id", "spaceId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_clientId_spaceId_bookingDate_key" ON "Booking"("clientId", "spaceId", "bookingDate");
CREATE TABLE "new_Client" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("cellphone", "name", "surname") SELECT "cellphone", "name", "surname" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" TEXT NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("clientId", "comment", "createdAt", "id", "rating", "spaceId") SELECT "clientId", "comment", "createdAt", "id", "rating", "spaceId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_clientId_spaceId_key" ON "Review"("clientId", "spaceId");
CREATE TABLE "new_Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "isFullSpaceBooking" BOOLEAN NOT NULL,
    "typology" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "images" JSONB,
    "avgRating" DECIMAL DEFAULT 0,
    CONSTRAINT "Space_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Space" ("agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "price", "seats", "typology") SELECT "agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "price", "seats", "typology" FROM "Space";
DROP TABLE "Space";
ALTER TABLE "new_Space" RENAME TO "Space";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT,
    "oauthProvider" TEXT NOT NULL,
    "oauthId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "oauthId", "oauthProvider", "password", "role") SELECT "createdAt", "email", "id", "oauthId", "oauthProvider", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Service_detail_key" ON "Service"("detail");
