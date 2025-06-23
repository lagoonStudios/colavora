CREATE TABLE `cod` (
	`codTypeID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codType` text,
	`companyID` text NOT NULL,
	`lang` text NOT NULL,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdDate` text,
	`comment` text NOT NULL,
	`shipmentID` integer NOT NULL,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exceptions` (
	`reasonID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyID` text,
	`customerID` integer,
	`reasonCode` text,
	`reasonDesc` text,
	`reasonCodeDesc` text,
	`completeOrder` integer DEFAULT false NOT NULL,
	`lang` text NOT NULL,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `manifests` (
	`manifest` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driverID` integer,
	`manifestDate` text,
	`manifestId` text,
	`manifestType` text,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pieces` (
	`pieceID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyID` text,
	`barcode` text,
	`packageType` integer,
	`packageTypeName` text,
	`comments` text,
	`pwBack` text,
	`pod` text,
	`shipmentID` integer NOT NULL,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`addressLine1` text,
	`addressLine2` text,
	`assignDL` integer,
	`assignPK` integer,
	`barcode` text,
	`city` text,
	`codAmount` real,
	`codType` text,
	`companyID` text NOT NULL,
	`consigneeName` text,
	`consigneeNum` text,
	`contactPerson` text,
	`createdDate` text,
	`createdUserID` integer,
	`division` text,
	`driverAssign` integer,
	`dueDate` text,
	`items` text,
	`lastEventComment` text,
	`lastTransferDate` text,
	`latitude` real,
	`longitude` real,
	`manifest` integer NOT NULL,
	`manifestDL` integer,
	`manifestPk` integer,
	`orderNotes` text,
	`packageType` integer,
	`phoneNumber` text,
	`photoOnDelivery` integer,
	`photoOnEvent` integer,
	`qty` integer,
	`readyDate` text,
	`reason` text,
	`referenceNo` text,
	`sender` text,
	`senderAddressLine1` text,
	`senderAddressLine2` text,
	`senderContactPerson` text,
	`senderName` text,
	`senderPhoneNumber` text,
	`senderZip` text,
	`serviceType` integer,
	`serviceTypeName` text,
	`shipmentID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`signatureOnDelivery` integer,
	`status` text NOT NULL,
	`templateID` integer,
	`waybill` text,
	`zip` text,
	`isSync` integer DEFAULT true NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `eventsQueue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`body` text NOT NULL,
	`eventType` text NOT NULL,
	`shipmentID` integer NOT NULL,
	`tries` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `shipment_idx` ON `eventsQueue` (`shipmentID`);