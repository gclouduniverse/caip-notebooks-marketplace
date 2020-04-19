FROM gcr.io/deeplearning-platform-release/tf2-gpu

# Deleting old extension
RUN /opt/conda/bin/jupyter labextension uninstall @jupyter-widgets/jupyterlab-manager
RUN /opt/conda/bin/jupyter labextension uninstall @jupyterlab/git
RUN /opt/conda/bin/jupyter labextension uninstall nbdime-jupyterlab

# Installing latest JupyterLab2
RUN conda install -c conda-forge -y jupyterlab

# Installing debugger
RUN /opt/conda/bin/conda install -c conda-forge -y xeus-python ptvsd nodejs
RUN /opt/conda/bin/jupyter labextension install @jupyterlab/debugger

# Enable Dark Theme
RUN mkdir -p /root/.jupyter/lab/user-settings/@jupyterlab/apputils-extension/
RUN echo "{'theme': 'JupyterLab Dark'}" >> /root/.jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings

# Install PlotLy
RUN /opt/conda/bin/conda install -y plotly
RUN /opt/conda/bin/jupyter labextension install jupyterlab-plotly

# Install DrawIO
RUN /opt/conda/bin/jupyter labextension install jupyterlab-drawio

# Install latest JupyterLab git
RUN /opt/conda/bin/pip install --upgrade jupyterlab-git
RUN /opt/conda/bin/jupyter lab build

# Install latest nbdime
RUN /opt/conda/bin/pip install --upgrade nbdime
RUN nbdime extensions --enable
