import { ProjectsGcpClient, Project } from "./ProjectsGcpClient";
import { GceRegionsClient, Region } from "./GceRegionsClient";
import * as $ from "jquery";
import { FastAiDeploymnetClient } from "./FastAiDeploymnetClient";

const ROOT_MODAL_ID: string = "deployModalDialog";
const PROJECTS_DROPDOWN_ID: string = "projectsDropDown";
const PROJECTS_DROPDOWN_BTN_ID: string = "projectsDropDownBtn";
const REGIONS_DROPDOWN_ID: string = "regionsDropDown";
const REGIONS_DROPDOWN_BTN_ID: string = "regionsDropDownBtn";
const ZONES_DROPDOWN_ID: string = "zonesDropDown";
const ZONES_DROPDOWN_BTN_ID: string = "zonesDropDownBtn";
const NAME_INPUT_ID: string = "nameInput";


export class DeployController {

    private projectGcpClient: ProjectsGcpClient;
    private projectsDropDown: HTMLElement;
    private projectsDropDownBtn: HTMLElement;

    private gceRegionsClient: GceRegionsClient;
    private regionsDropDown: HTMLElement;
    private regionsDropDownBtn: HTMLElement;

    private zonesDropDown: HTMLElement;
    private zonesDropDownBtn: HTMLElement;

    private selectedProjectId: string;
    private selectedProjectNumber: string;

    private nameInputField: HTMLInputElement;

    constructor(apiKey: string) {

        this.projectGcpClient = new ProjectsGcpClient(apiKey);
        this.projectsDropDown = document.getElementById(PROJECTS_DROPDOWN_ID);
        this.projectsDropDownBtn = document.getElementById(PROJECTS_DROPDOWN_BTN_ID);

        this.gceRegionsClient = new GceRegionsClient();
        this.regionsDropDown = document.getElementById(REGIONS_DROPDOWN_ID);
        this.regionsDropDownBtn = document.getElementById(REGIONS_DROPDOWN_BTN_ID);

        this.zonesDropDown = document.getElementById(ZONES_DROPDOWN_ID);
        this.zonesDropDownBtn = document.getElementById(ZONES_DROPDOWN_BTN_ID);

        this.nameInputField = document.getElementById(NAME_INPUT_ID) as HTMLInputElement;
    }

    public showDeployDialog() {
        // TODO: this need to be converted to a proper bootstrap type.
        $("#" + ROOT_MODAL_ID).modal('show');
        
        this.projectGcpClient.requestProjects(
            (projects: Project[]) => {
                this.addToDropDown<Project>(this.projectsDropDownBtn, this.projectsDropDown, projects, (project: Project, newAnchorItem: HTMLAnchorElement): void => {
                    newAnchorItem.textContent = project.name;
                }, (project) => {
                    this.selectedProjectId = project.projectId;
                    this.selectedProjectNumber = project.projectNumber;
                });
            }
        );

        const regionsToZones: {[region: string]: string[]} = {}
        this.gceRegionsClient.requestRegions(
            (regions: Region[]) => {
                this.addToDropDown<Region>(this.regionsDropDownBtn, this.regionsDropDown, regions, (region: Region, newAnchorItem: HTMLAnchorElement): void => {
                    newAnchorItem.textContent = region.name;
                    regionsToZones[region.name] = region.zones;
                }, (item: Region) => {

                    const fullZones: string[] = regionsToZones[item.name];
                    console.log(fullZones);
                    console.log(item.name);
                    const zones = fullZones.map((fullZone: string): string => {
                        const zoneComponent: string[] = fullZone.split("/");
                        console.log(zoneComponent);
                        console.log(zoneComponent[zoneComponent.length - 1]);
                        return zoneComponent[zoneComponent.length - 1];
                    });
                    console.log(zones);
                    this.addToDropDown<string>(this.zonesDropDownBtn, this.zonesDropDown, zones, (zone: string, anchor: HTMLAnchorElement) => {
                        anchor.textContent = zone;
                    }, (zone: string) => {
                        document
                            .getElementById("deployBtn")
                            .addEventListener("click",
                                            (e:Event) => {
                                                this.deployNotebook("fastai");
                                            });
                    });
                });
            }
        );
    }

    private addToDropDown<T>(dropDownElementBtn: HTMLElement, dropDownElement: HTMLElement, items: T[], configureAnchor: (item: T, anchor: HTMLAnchorElement) => void, onClick: (item: T) => void): void {
        while (dropDownElement.firstChild) {
            dropDownElement.removeChild(dropDownElement.firstChild);
        }
        items.forEach(item => {
            const newAnchorItem = document.createElement("a");
            newAnchorItem.classList.add("dropdown-item");
            configureAnchor(item, newAnchorItem);
            dropDownElement.appendChild(newAnchorItem);
            newAnchorItem.onclick = () => {
                dropDownElementBtn.textContent = newAnchorItem.textContent;
                if (!!onClick) {
                    onClick(item);
                }
            }
        });

    }

    public deployNotebook(name: string) {
        const fastAiDeploymnetClient = new FastAiDeploymnetClient(
            this.selectedProjectId,
            this.zonesDropDownBtn.textContent, 
            this.nameInputField.value, 
            this.regionsDropDownBtn.textContent,
            this.selectedProjectNumber);
        fastAiDeploymnetClient.deploy();
    }
}