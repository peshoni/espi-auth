#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t espi-backend .
docker images
docker tag espi-backend "$DOCKER_USERNAME"/espi-backend
docker push "$DOCKER_USERNAME"/espi-backend