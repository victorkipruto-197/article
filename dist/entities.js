"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Package = exports.SectionType = exports.Workflow = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Publisher"] = "publisher";
    Role["Sales"] = "sales";
    Role["SocialMediaManager"] = "social_media_manager";
    Role["Editor"] = "editor";
    Role["PageDesigner"] = "page_designer";
    Role["Illustrator"] = "illustrator";
    Role["StaffWriter"] = "staff_writer";
    Role["Columnist"] = "columnist";
    Role["Customer"] = "customer";
})(Role || (exports.Role = Role = {}));
exports.Workflow = [
    "writing",
    "illustration",
    "columnary",
    "editorial",
    "sales",
    "pagedesign",
    "publishing",
    "social_media",
    "archiving",
    "deleted"
];
var SectionType;
(function (SectionType) {
    SectionType[SectionType["Headline"] = 0] = "Headline";
    SectionType[SectionType["SubHeadline"] = 1] = "SubHeadline";
    SectionType[SectionType["ByLine"] = 2] = "ByLine";
    SectionType[SectionType["Dateline"] = 3] = "Dateline";
    SectionType[SectionType["Lead"] = 4] = "Lead";
    SectionType[SectionType["Context"] = 5] = "Context";
    SectionType[SectionType["MainContent_SubHeading"] = 6] = "MainContent_SubHeading";
    SectionType[SectionType["MainContent_Paragraph"] = 7] = "MainContent_Paragraph";
    SectionType[SectionType["MainContent_Quotes"] = 8] = "MainContent_Quotes";
    SectionType[SectionType["MainContent_Statistics"] = 9] = "MainContent_Statistics";
    SectionType[SectionType["Call_To_Action"] = 10] = "Call_To_Action";
    SectionType[SectionType["Author_Bio"] = 11] = "Author_Bio";
    SectionType[SectionType["Sources"] = 12] = "Sources";
    SectionType[SectionType["Image"] = 13] = "Image";
    SectionType[SectionType["Video"] = 14] = "Video";
    SectionType[SectionType["File"] = 15] = "File";
})(SectionType || (exports.SectionType = SectionType = {}));
var Package;
(function (Package) {
    Package[Package["Gold"] = 0] = "Gold";
    Package[Package["Silver"] = 1] = "Silver";
    Package[Package["Bronze"] = 2] = "Bronze";
    Package[Package["Custom"] = 3] = "Custom";
    Package[Package["Staff"] = 4] = "Staff";
})(Package || (exports.Package = Package = {}));
var Status;
(function (Status) {
    Status["SUCCESS"] = "success";
    Status["FAILED"] = "failed";
})(Status || (exports.Status = Status = {}));
