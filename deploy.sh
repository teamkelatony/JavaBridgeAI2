#!/bin/bash
export JAVA_HOME=$(/usr/libexec/java_home -v 1.7)
appcfg.sh -A appinventortojava update appinventor/appengine/build/war
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
