/*
  Warnings:

  - You are about to drop the column `seatsBooked` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfSpaces` on the `Space` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "bookingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingDate", "clientId", "createdAt", "id", "spaceId") SELECT "bookingDate", "clientId", "createdAt", "id", "spaceId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "isFullSpaceBooking" BOOLEAN NOT NULL,
    "typology" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "images" JSONB,
    "avgRating" DECIMAL DEFAULT 0,
    CONSTRAINT "Space_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Space" ("agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "price", "seats", "typology") SELECT "agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "price", "seats", "typology" FROM "Space";
DROP TABLE "Space";
ALTER TABLE "new_Space" RENAME TO "Space";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
