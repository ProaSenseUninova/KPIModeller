INSERT INTO kpi_agg_type VALUES(1,'none')
INSERT INTO kpi_agg_type VALUES(2,'minimum')
INSERT INTO kpi_agg_type VALUES(3,'maximum')
INSERT INTO kpi_agg_type VALUES(4,'average')
INSERT INTO kpi_agg_type VALUES(5,'sum')
INSERT INTO kpi_agg_type VALUES(6,'count')
INSERT INTO granularity VALUES(1,'monthly')
INSERT INTO granularity VALUES(2,'weekly')
INSERT INTO granularity VALUES(3,'daily')
INSERT INTO granularity VALUES(4,'hourly')
INSERT INTO machine VALUES(1,'KM-1000 (1)')
INSERT INTO machine VALUES(2,'KM-1000 (2)')
INSERT INTO machine VALUES(3,'KM-1000 (3)')
INSERT INTO machine VALUES(4,'ENGEL-1750 (4)')
INSERT INTO machine VALUES(5,'ENGEL-1750 (5)')
INSERT INTO product VALUES(1,'Golf Halogen','254.253')
INSERT INTO product VALUES(2,'Golf AFS','173.42')
INSERT INTO product VALUES(3,'Insignia','168.857')
INSERT INTO product VALUES(4,'Qashqai P32L MC 010','174454')
INSERT INTO product VALUES(5,'Qashqai P32L MC 011','271.535')
INSERT INTO product VALUES(6,'Astra Delta GVC','171.572')
INSERT INTO product VALUES(7,'Insignia GMX 350','172.306')
INSERT INTO product VALUES(8,'Master X62','170.644')
INSERT INTO product VALUES(9,'Twingo','271.535')
INSERT INTO product VALUES(10,'Pathfinder','170.09')
INSERT INTO product VALUES(11,'Renault X10','180.585')
INSERT INTO product VALUES(12,'Picasso','162.979')
INSERT INTO product VALUES(13,'Insignia Nova','178.522')
INSERT INTO product VALUES(14,'Astra 3300','160.201')
INSERT INTO product VALUES(15,'Renault X82','188.716')
INSERT INTO product VALUES(16,'Edison','190.89')
INSERT INTO product VALUES(17,'X12','187.829')
INSERT INTO product VALUES(18,'Mercedes E 413','166.413')
INSERT INTO product VALUES(19,'Mercedes E AMG 071','166.071')
INSERT INTO product VALUES(20,'Opel Corsa 2K','195.429')
INSERT INTO product VALUES(21,'Porsche','null')
INSERT INTO product VALUES(22,'Lamborghini','null')
INSERT INTO product VALUES(23,'Koleos','null')
INSERT INTO product VALUES(24,'Mercedes','182.994')
INSERT INTO product VALUES(25,'BMW','155.031')
INSERT INTO product VALUES(26,'Clio','null')
INSERT INTO product VALUES(27,'Lancia','null')
INSERT INTO product VALUES(28,'Zaslnoka Mala','193.1')
INSERT INTO product VALUES(29,'Zaslonka Srednja','193.094')
INSERT INTO product VALUES(30,'Zaslonka Velika','193.092')
INSERT INTO product VALUES(31,'Ohi\u0161je X12','188.104')
INSERT INTO product VALUES(32,'Radomi','199.148')
INSERT INTO product VALUES(33,'Jaguar 2k','155.031')
INSERT INTO product VALUES(34,'Jaguar zadnja','197.335')
INSERT INTO product VALUES(35,'Omega','149.856')
INSERT INTO sensor VALUES(1,'count',1,'hour')
INSERT INTO sensor VALUES(2,'count good',1,'hour')
INSERT INTO sensor VALUES(3,'count bad',1,'hour')
INSERT INTO sensor VALUES(4,'uptime',1,'hour')
INSERT INTO sensor VALUES(5,'available time',1,'hour')
INSERT INTO sensor VALUES(6,'ideal cycle time',1,'hour')
INSERT INTO sensor VALUES(7,'operating time',1,'hour')
INSERT INTO mould VALUES(1,1,'Golf Halogen','254.253-00U011',60)
INSERT INTO mould VALUES(2,2,'Golf AFS','173.420-01U011',62)
INSERT INTO mould VALUES(3,3,'Insignia 010','168.857-01U010',58)
INSERT INTO mould VALUES(4,3,'Insignia 011','168.857-01U011',58)
INSERT INTO mould VALUES(5,4,'Qashqai P32L MC 010','174454-01U010',57)
INSERT INTO mould VALUES(6,5,'Qashqai P32L MC 011','271.535-00U010',60)
INSERT INTO mould VALUES(7,6,'Astra Delta GVC 010','171.572-01U010',63)
INSERT INTO mould VALUES(8,6,'Astra Delta GVC 011','171.572-01U011',66)
INSERT INTO mould VALUES(9,6,'Astra Delta GVC 012','171.572-01U012',69)
INSERT INTO mould VALUES(10,7,'Insignia GMX 350','172.306-01U010',60)
INSERT INTO mould VALUES(11,8,'Master X62','170.644-01U010',60)
INSERT INTO mould VALUES(12,9,'Twingo','271.535-00U010',60)
INSERT INTO mould VALUES(13,10,'Pathfinder','170.090-01U010',60)
INSERT INTO mould VALUES(14,11,'Renault X10','180.585-01U010',60)
INSERT INTO mould VALUES(15,12,'Picasso 010','162.979-00U010',61)
INSERT INTO mould VALUES(16,12,'Picasso 011','162.979-00U011',61)
INSERT INTO mould VALUES(17,13,'Insignia Nova','178.522-01U010',61)
INSERT INTO mould VALUES(18,14,'Astra 3300 010','160.201-00U010',61)
INSERT INTO mould VALUES(19,14,'Astra 3300 011','160.201-00U011',61)
INSERT INTO mould VALUES(20,14,'Astra 3300 012','160.203-00U010',61)
INSERT INTO mould VALUES(21,15,'Renault X82','188.716-01U010',61)
INSERT INTO mould VALUES(22,16,'Edison','190.890-01U010',62)
INSERT INTO mould VALUES(23,17,'X12','187.829-01U010',62)
INSERT INTO mould VALUES(24,18,'Mercedes E 413 or.1','166.413-00U010',62)
INSERT INTO mould VALUES(25,18,'Mercedes E 413 or.2','166.413-00U011',62)
INSERT INTO mould VALUES(26,19,'Mercedes E AMG 071','166.071-01U010',29)
INSERT INTO mould VALUES(27,20,'Opel Corsa 2K','195.429-U00U11',53)
INSERT INTO mould VALUES(28,21,'Porsche','null',47)
INSERT INTO mould VALUES(29,22,'Lamborghini','null',0)
INSERT INTO mould VALUES(30,23,'Koleos','null',0)
INSERT INTO mould VALUES(31,24,'Mercedes','182.994.01/02',0)
INSERT INTO mould VALUES(32,25,'BMW','155.031/032-00',0)
INSERT INTO mould VALUES(33,26,'Clio','null',0)
INSERT INTO mould VALUES(34,27,'Lancia','null',0)
INSERT INTO mould VALUES(35,28,'Zaslnoka Mala Siva','193.100-11/12',0)
INSERT INTO mould VALUES(36,28,'Zaslonka Mala ?rna','193.100-13/14',0)
INSERT INTO mould VALUES(37,29,'Zaslonka Srednja Siva \u0160pica','193.094-11/12',0)
INSERT INTO mould VALUES(38,29,'Zaslonka Srednja Siva','193.094-13/14',0)
INSERT INTO mould VALUES(39,29,'Zaslonka Srednja ?rna \u0160pica','193.094-15/16',0)
INSERT INTO mould VALUES(40,30,'Zaslonka Velika Siva','193.092-11/12',0)
INSERT INTO mould VALUES(41,30,'Zaslonka Velika ?rna','193.092-13/14',0)
INSERT INTO mould VALUES(42,31,'Ohi\u0161je X12','188.104-210/220',0)
INSERT INTO mould VALUES(43,32,'Radomi notranje','199.148-30',0)
INSERT INTO mould VALUES(44,32,'Radomi zunanje','199.148-40',0)
INSERT INTO mould VALUES(45,33,'Jaguar 2k','null',0)
INSERT INTO mould VALUES(46,20,'Corsa 2K or.2','195.429-U00U11',53)
INSERT INTO mould VALUES(47,34,'Jaguar zadnja mala le?a','197.338-110/120',0)
INSERT INTO mould VALUES(48,34,'Jaguar zadnja velika le?a','197.335-110/120',0)
INSERT INTO mould VALUES(49,35,'Omega','149.856-01/02',0)
INSERT INTO shift VALUES(1,'Shift I')
INSERT INTO shift VALUES(2,'Shift II')
INSERT INTO shift VALUES(3,'Shift III')
INSERT INTO kpi VALUES(1,NULL,'Count','Amount of product created. This can be defined per machine, employee, shit or the whole plant.',1,'hour','1','1','1','1','simple',6,'NUMERIC','DECIMAL',TRUE)
INSERT INTO kpi VALUES(2,1,'Good parts','Amount of products produced with acceptable quality.',1,'hour','1','1','1','1','simple',6,'NUMERIC','DECIMAL',TRUE)
INSERT INTO kpi VALUES(3,1,'Scrapped parts','Amount of products produced that are rejected.',1,'hour','1','1','1','1','simple',6,'NUMERIC','DECIMAL',TRUE)
INSERT INTO kpi VALUES(4,NULL,'Scrap rate','Relation of product inappropriate to sell.',1,'hour','1','1','1','1','composed',1,'NUMERIC','PERCENTAGE',TRUE)
INSERT INTO kpi VALUES(5,NULL,'Availability','Percentage of scheduled time that the operation is available to operate.',1,'hour','0','1','0','1','composed',1,'NUMERIC','PERCENTAGE',FALSE)
INSERT INTO kpi VALUES(6,NULL,'Performance','Speed at which the operation runs as a percentage of its designed speed.',1,'hour','0','1','0','1','composed',1,'NUMERIC','PERCENTAGE',FALSE)
INSERT INTO kpi VALUES(7,NULL,'Quality','Good units produced as a percentage of the total units started.',1,'hour','1','1','1','1','composed',1,'NUMERIC','PERCENTAGE',TRUE)
INSERT INTO kpi VALUES(8,NULL,'OEE','Evaluates how effectively an operation is used. Quantifies how well a manufacturing unit performs relative to its designed capacity, during the periods when it is scheduled to run.',1,'hour','1','1','1','1','composed',1,'NUMERIC','PERCENTAGE',FALSE)
INSERT INTO kpi_formula VALUES(1,4,3,NULL,'/',1,NULL,NULL,NULL,NULL,NULL)
INSERT INTO kpi_formula VALUES(2,5,NULL,4,'/',NULL,5,NULL,NULL,NULL,NULL)
INSERT INTO kpi_formula VALUES(3,6,1,NULL,'*',NULL,6,'/',NULL,7,NULL)
INSERT INTO kpi_formula VALUES(4,7,2,NULL,'/',1,NULL,NULL,NULL,NULL,NULL)
INSERT INTO kpi_formula VALUES(5,8,5,NULL,'*',6,NULL,'*',7,NULL,NULL)
INSERT INTO kpi_formula VALUES(6,1,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
INSERT INTO kpi_formula VALUES(7,2,NULL,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
INSERT INTO kpi_formula VALUES(8,3,NULL,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL)