#!/bin/bash

echo "$TIMEOUT"

echo -e "\n---------------------------"
timeout $TIMEOUT /bin/bash /scripts/install.sh || exit $?
echo -e "\n---------------------------"
timeout $TIMEOUT /bin/bash /scripts/pre_build.sh || exit $?
echo -e "\n---------------------------"
timeout $TIMEOUT /bin/bash /scripts/build.sh || exit $?
echo -e "\n---------------------------"
timeout $TIMEOUT /bin/bash /scripts/post_build.sh || exit $?