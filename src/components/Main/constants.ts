import { NotebookProps } from "../../common/types";

const notebooks: NotebookProps[] = [
  {
    id: "1",
    imgSrc: "images/jupyterlab2.png",
    title: "JupyterLab2 with Python Debugger, TensorFlow 2.1 and CUDA 10",
    text:
    `Latest build of JupyterLab2 with pre-configured debugger for Python and TensorFlow 2.1.`,
    author: "Viacheslav Kovalevskyi",
    lastUpdateDate: new Date(2020, 4, 19),
    deploymentCode: "jupyterlab2",
    readMore: "https://github.com/gclouduniverse/caip-notebooks-marketplace/wiki/JupyterLab2-Notebooks-Solution"
  },
  {
    id: "2",
    imgSrc: "images/fast.ai.png",
    title: "fast.ai focused notebooks IDE",
    text: `Includes latest fast.ai as well as classical Notebook IDE (since fast.ai is not yet fully compatible with JupyterLab).`,
    author: "Viacheslav Kovalevskyi",
    lastUpdateDate: new Date(2019, 9, 12),
    deploymentCode: "fastai",
    readMore: ""
  }
];

export { notebooks };
