# /bin/bash

if [ "$1" = "--html" ];then

    cd sphinx
    rm -rf source/modules/
    sphinx-apidoc -f -o source/modules ../../feedbag
    sphinx-build -b html source build

fi
