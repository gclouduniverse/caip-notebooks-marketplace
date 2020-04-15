CONTAINER_URL="theiaide/theia:next"
CONTAINER_NAME="theiaide"
if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi
docker run -d \
       --net host \
       -v "$(pwd):/home/project:cached" \
       "${CONTAINER_URL}"