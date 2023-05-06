enum Category {
  "Source" = "Source",
  "Build" = "Build",
  "Test" = "Test",
  "Deploy" = "Deploy",
  "Approval" = "Approval",
}

enum Provider {
  "Github" = "Github",
  "Docker" = "Docker",
  "Manual" = "Manual",
}

enum Phases {
  "install",
  "pre_build",
  "build",
  "post_build",
}

enum EnvType {
  "PLAINTEXT" = "PLAINTEXT",
}

interface IPhase {
  "on-failure": "ABORT";
  commands: string[];
  finally: string[];
  report: any;
  artifacts: any;
}

interface IPhaseParsed {
  commands: string;
  finally: string;
}

interface IBuild {
  version: number;
  phases: { [key: string]: IPhase };
}

interface IJob {
  env: string[];
  timeout: number;
  image: string;
  tasks: IBuild;
}

interface IAction {
  Name: string;
  ActionTypeId: {
    Category: Category;
    Provider: Provider;
  };
  Configuration: {
    ProjectName?: string;
    Connection?: string; // When Action Type Id is Source
    FullRepositoryId?: string; // When Action Type Id is Source
    BranchName?: string; // When Action Type Id is Source
    DetectChanges?: boolean; // When Action Type Id is Source
  };
  RunOrder: number;
}

interface IEnvironmentVariable {
  Name: string;
  Value: string;
  Type: EnvType;
}

interface IStage {
  Name: string;
  Actions: IAction[];
}

interface IPipeline {
  Name: string;
  Stages: IStage[];
}

interface IStep {
  Name: string;
  Description: string;
  Environment: {
    Image: string;
    EnvironmentVariables: IEnvironmentVariable[];
  };
  BuildSpec: string;
  TimeoutInMinutes: number;
}

interface IDefinition {
  Pipeline: IPipeline;
  [key?: string]: IStep;
}
