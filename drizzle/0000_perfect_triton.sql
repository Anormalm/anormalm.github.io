CREATE TABLE `visitor_signals` (
	`day` text NOT NULL,
	`country_code` text NOT NULL,
	`latitude_cell` integer NOT NULL,
	`longitude_cell` integer NOT NULL,
	`signal_count` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`day`, `country_code`, `latitude_cell`, `longitude_cell`)
);
