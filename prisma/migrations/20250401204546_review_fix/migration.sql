/*
  Warnings:

  - You are about to alter the column `avgRating` on the `Space` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.
  - A unique constraint covering the columns `[clientId,spaceId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "agencyId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "numberOfSpaces" INTEGER NOT NULL,
    "isFullSpaceBooking" BOOLEAN NOT NULL,
    "typology" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "images" JSONB,
    "avgRating" DECIMAL DEFAULT 0,
    CONSTRAINT "Space_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Space" ("agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "numberOfSpaces", "price", "seats", "typology") SELECT "agencyId", "avgRating", "description", "id", "images", "isFullSpaceBooking", "name", "numberOfSpaces", "price", "seats", "typology" FROM "Space";
DROP TABLE "Space";
ALTER TABLE "new_Space" RENAME TO "Space";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Review_clientId_spaceId_key" ON "Review"("clientId", "spaceId");
