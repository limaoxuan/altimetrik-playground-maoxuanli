#!/usr/bin/env bash
mvn clean
mvn package -Dmaven.test.skip=true
docker build -t life14ok/college-search .
docker push life14ok/college-search
