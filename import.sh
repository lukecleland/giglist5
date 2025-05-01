#!/bin/bash
unzip /giglist5.sql.zip -d /tmp
mysql -u root -proot giglist < /tmp/giglist5.sql
