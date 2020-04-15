import { NotebookProps } from "../../common/types";

const notebooks: NotebookProps[] = [
  {
    id: "1",
    imgSrc: "images/theia.svg",
    title: "Cloud & Desktop IDE Platform",
    text: `Eclipse Theia is an extensible platform to develop multi-language Cloud & Desktop IDEs with state-of-the-art web technologies. Learn more on: https://theia-ide.org/`,
    author: "Viacheslav Kovalevskyi",
    lastUpdateDate: new Date(2020, 4, 12),
    deploymentCode: "theia"
  },
  {
    id: "2",
    imgSrc: "images/fast.ai.png",
    title: "fast.ai focused notebooks IDE",
    text: `Includes latest fast.ai as well as classical Notebook IDE (since fast.ai is not yet fully compatible with JupyterLab).`,
    author: "Viacheslav Kovalevskyi",
    lastUpdateDate: new Date(2019, 9, 12),
    deploymentCode: "fastai"
  }
];

export { notebooks };
