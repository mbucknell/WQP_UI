# Build the static assets in the node.js container.
FROM wqp_assets as assets

RUN npm run build

# Base off the community Python image
FROM public.ecr.aws/bitnami/python:3.8

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR $HOME/application

COPY requirements.txt .
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements.txt -r requirements-dev.txt

# Add source files and pre-compile them
COPY . $HOME/application

RUN python -m compileall -f
RUN python -m compileall -f .

# Copy static files from the assets image to this one.
COPY --from=assets /assets/dist/ /assets

# Use environment variables for application configuration rather than an
# instance/config.py module.
ENV NO_INSTANCE_CONFIG=1
ENV ASSET_MANIFEST_PATH=/assets/rev-manifest.json
ENV CONTAINER_RUN=1

USER $USER

EXPOSE 5050

CMD ["gunicorn", "--config", "gunicorn.conf.py", "wqp:app"]
