"""
An OpenAI-compatible model server on Modal (vLLM), for describe-colors.js:

    MODEL=casperhansen/llama-3.3-70b-instruct-awq modal deploy scripts/tools/modal-llm.py
    DESCRIBE_API_KEY=… node scripts/tools/describe-colors.js --api=openai --host=<the printed url> --concurrency=32

Only callers with the key get in: it's the Modal secret color-descriptions-api
(VLLM_API_KEY), sent as a bearer token.

The weights are kept in a Modal volume, so only the first start downloads
them. The server shuts down after a few idle minutes; `modal app stop
color-descriptions` stops it at once.
"""

import os
import subprocess

import modal

MODEL = os.environ.get("MODEL", "casperhansen/llama-3.3-70b-instruct-awq")
GPU = os.environ.get("GPU", "H100")
PORT = 8000

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("vllm==0.10.1.1", "transformers==4.56.2", "huggingface_hub[hf_transfer]")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "MODEL": MODEL})
)
weights = modal.Volume.from_name("color-descriptions-weights", create_if_missing=True)
app = modal.App("color-descriptions")


@app.function(
    image=image,
    gpu=GPU,
    volumes={"/root/.cache/huggingface": weights},
    secrets=[modal.Secret.from_name("color-descriptions-api")],
    timeout=60 * 60 * 6,
    scaledown_window=5 * 60,
    max_containers=1,
)
@modal.concurrent(max_inputs=128)
@modal.web_server(port=PORT, startup_timeout=60 * 30)
def serve():
    subprocess.Popen(
        [
            "vllm",
            "serve",
            os.environ["MODEL"],
            "--served-model-name",
            "describer",
            "--host",
            "0.0.0.0",
            "--port",
            str(PORT),
            "--max-model-len",
            "8192",
            "--gpu-memory-utilization",
            "0.92",
            "--enable-prefix-caching",
            "--api-key",
            os.environ["VLLM_API_KEY"],
        ]
    )
