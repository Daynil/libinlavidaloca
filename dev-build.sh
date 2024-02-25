#!/bin/bash

watchexec --restart --watch src --exts py,js,html,jinja,css -- python ./scripts/build.py &
watchexec --restart --watch public --exts py,js,html,jinja,css -- python -m http.server --directory public 8080