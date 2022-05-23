#####################
### jsonnet convert to yaml
### command: dron jsonnet --steam
### 下完command後，會附蓋掉.drone.yml
#####################
// 這塊目前不需使用
local conditionWhen(env="qa")=
    (if env=="QA" then {
        branch: ["develop"],
        event: ["push"]
    }else if env=="prod" then {
        ref: ["refs/tags/Prod*"],
    }
);

local conditionTrigger(env="qa")=
(
    if env =="QA" then {
        ref: ["refs/tags/QA-*"],
        event: ["tag"],
    }else if env=="Beta" then {
        ref: ["refs/tags/Beta-*"],
        event: ["tag"],
    }else if env=="Prod" || env== "Demo" then  {
        ref: ["refs/tags/Prod-*"],
        event: ["tag"],
    }
);


local Pipeline(name="QA",cluster="xbb-common",zone="asia-east1-a",
env="qa",deployName="yaboxxx-landing-page-qa",nginxssl="nginx-ssl",nginxConfig="yaboxxx-landing-page-nginx"
,imageName="yaboxxx-landingpage") = {
    kind: "pipeline",
    type: "kubernetes",
    name: "yaboLandingPipeline("+ name +")",
    steps:[
        {

            name: "push2GCR-"+name,
            image: "plugins/gcr",
            depends_on: (if env=="prod" || env =="demo" then ["clone"]),
            settings: {
                repo: "gcr.io/rd7-project/"+imageName,
                tags: ["latest",env+"-${DRONE_COMMIT}","${DRONE_TAG}"],
                json_key: { "from_secret":"GOOGLE_CREDENTIALS"},
                build_args: ["website="+env],
            },
            // when :
            //     conditionWhen(env)
            // when:
            // {
            //     branch: ["develop"]
            //     event: ["push"],
            // },
        },
        {
            name: "deploy2GKE-"+name,
            image: "nytimes/drone-gke",
            depends_on: (if env=="prod" || env =="demo" then ["push2GCR-"+name]),
            environment:{
                TOKEN: {"from_secret": "GOOGLE_CREDENTIALS"},
            },
            settings:{
                project: "rd7-project",
                vars:
                    {"deployName":deployName,
                    "env":env,
                    "k8sNginxSSL":nginxssl,
                    "k8sNginxConfigMap":nginxConfig,
                    "imageName":imageName
                    }
                ,
                zone: zone,
                cluster: cluster,
            },
            // when :
            //     conditionWhen(env)
        },
    ],
    trigger:
        conditionTrigger(name)
    // trigger:
    //     ref: ["refs/heads/master"],
    //     event: ["tag"],
};



[
//     (name="QA"（環境),cluster="xbb-common"（叢集),zone="asia-east1-a"(區域),
// env="qa"(GKE的label),deployName="yaboxxx-landing-page-qa"(GKE的名稱),nginxssl="nginx-ssl",nginxConfig="nginx"(GKE的configMap,nginx設定檔名稱),
// imageName="yaboxxx-landingpage"(GCR映像檔名稱))
    Pipeline("QA","yellow-video-test","asia-east1-b"
    ,"qa","video-vui-qa","nginx-ssl-qa","video-vui-nginx-qa"
    ,"video-ui-vue"),
    Pipeline("Prod","yellow-video-prod","asia-east1-b",
    "prod","video-vui-prod","nginx-ssl-prod","video-vui-nginx-prod"
    ,"video-ui-vue"),
]
