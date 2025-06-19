CREATE TABLE `cod` (
	`codTypeID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codType` text,
	`companyID` text NOT NULL,
	`lang` text NOT NULL,
	`isSync` integer DEFAULT false NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdDate` text,
	`comment` text,
	`shipmentID` integer,
	`isSync` integer DEFAULT false NOT NULL,
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
	`isSync` integer DEFAULT false NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `manifests` (
	`manifest` text PRIMARY KEY NOT NULL,
	`companyID` text NOT NULL,
	`driverID` integer,
	`createdDate` text,
	`isSync` integer DEFAULT false NOT NULL,
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
	`isSync` integer DEFAULT false NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`shipmentID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyID` text NOT NULL,
	`waybill` text,
	`serviceType` integer,
	`serviceTypeName` text,
	`packageType` integer,
	`readyDate` text,
	`dueDate` text,
	`codType` text,
	`codAmount` real,
	`sender` text,
	`senderName` text,
	`senderAddressLine1` text,
	`senderAddressLine2` text,
	`senderZip` text,
	`senderPhoneNumber` text,
	`senderContactPerson` text,
	`orderNotes` text,
	`consigneeNum` text,
	`consigneeName` text,
	`addressLine1` text,
	`addressLine2` text,
	`zip` text,
	`phoneNumber` text,
	`contactPerson` text,
	`createdUserID` integer,
	`createdDate` text,
	`lastTransferDate` text,
	`status` text NOT NULL,
	`qty` integer,
	`items` text,
	`templateID` integer,
	`manifestDL` text,
	`assignPK` integer,
	`assignDL` integer,
	`division` text,
	`lastEventComment` text,
	`reason` text,
	`barcode` text,
	`referenceNo` text,
	`manifestPk` text,
	`manifest` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`city` text,
	`photoOnEvent` integer,
	`photoOnDelivery` integer,
	`isSync` integer DEFAULT false NOT NULL,
	`lastSync` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
DROP TABLE `lists`;--> statement-breakpoint
DROP TABLE `tasks`;