#!/bin/bash

/opt/conda/bin/conda install -c conda-forge -y xeus-python ptvsd nodejs
/opt/conda/bin/jupyter labextension install @jupyterlab/debugger