#!/bin/bash
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
ant -f $(pwd)/appinventor/appengine CopyBlocklyToBuildWar
export JAVA_HOME=$(/usr/libexec/java_home -v 1.7)
dev_appserver.sh --port=8888 --address=0.0.0.0 appinventor/appengine/build/war/
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)