#!/bin/bash
npm run build
gcloud app deploy --project mainapp website/app.yaml
