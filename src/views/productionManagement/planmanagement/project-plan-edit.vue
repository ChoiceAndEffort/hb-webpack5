<template>
    <div class="sub-page" v-loading="loading">
        <div id="preview" style="position:absolute;display: flex; height: 0;width: 0; z-index: -100; margin-left: -300000px;"></div>
        <el-button class="back-btn" type="primary" size="small" @click.native="$router.back()">返回</el-button>
        <div id="workSpace" style="padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px"></div>
        <div id="gantEditorTemplates" style="display:none;">
            <div class="__template__" type="GANTBUTTONS">
                <div class="ganttButtonBar noprint">
                    <div class="buttons">
                        <button onclick="$('#workSpace').trigger('addBelowCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert below"><span class="teamworkIcon">X</span></button>
                        <span class="ganttButtonSeparator requireCanWrite requireCanDelete"></span>
                        <button onclick="$('#workSpace').trigger('deleteFocused.gantt');return false;" class="button textual icon delete requireCanWrite" title="Elimina"><span class="teamworkIcon">&cent;</span></button>
                        <span class="ganttButtonSeparator"></span>
                        <button onclick="$('#workSpace').trigger('expandAll.gantt');return false;" class="button textual icon " title="EXPAND_ALL"><span class="teamworkIcon">6</span></button>
                        <button onclick="$('#workSpace').trigger('collapseAll.gantt'); return false;" class="button textual icon " title="COLLAPSE_ALL"><span class="teamworkIcon">5</span></button>
                        <span class="ganttButtonSeparator"></span>
                        <button onclick="$('#workSpace').trigger('zoomMinus.gantt'); return false;" class="button textual icon " title="zoom out"><span class="teamworkIcon">)</span></button>
                        <button onclick="$('#workSpace').trigger('zoomPlus.gantt');return false;" class="button textual icon " title="zoom in"><span class="teamworkIcon">(</span></button>
                    </div>

                    <div class="project">
                        <button class="button login" title="login/enroll" onclick="loginEnroll($(this));" style="display:none;">login/enroll</button>
                        <button class="button opt collab" title="Start with Twproject" onclick="collaborate($(this));" style="display:none;"><em>collaborate</em></button>
                    </div>
                </div>
            </div>
            <div class="__template__" type="TASKSEDITHEAD">
                <table class="gdfTable" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr style="height:40px">
                        <th class="gdfColHeader" style="width:35px; border-right: none"></th>
                        <th class="gdfColHeader" style="width:25px;"></th>
                        <th class="gdfColHeader gdfResizable" style="width:300px;">任务名</th>
                        <th class="gdfColHeader" align="center" style="width:120px;">操作</th>
                        <th class="gdfColHeader gdfResizable" style="width:80px;">开始时间</th>
                        <th class="gdfColHeader gdfResizable" style="width:80px;">结束时间</th>
                        <th class="gdfColHeader gdfResizable" style="width:50px;">工期</th>
                        <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:100px;text-align: left; padding-left: 10px;">前置任务</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div class="__template__" type="TASKROW">
                <tr id="tid_(#=obj.id#)" taskId="(#=obj.id#)" engineeringProjectId="(#=obj.engineeringProjectId#)" workingProcedurePlanId="(#=obj.workingProcedurePlanId#)" couplingId="(#=obj.couplingId#)" roundsPlanId="(#=obj.roundsPlanId#)"  class="taskEditRow (#=obj.isParent()?'isParent':''#) (#=obj.collapsed?'collapsed':''#)" level="(#=level#)">
                    <th class="gdfCell" align="right" style="cursor:pointer;"><span class="taskRowIndex">(#=obj.getRow()+1#)</span></th>
                    <td class="gdfCell noClip" align="center"><div class="taskStatus cvcColorSquare" status="(#=obj.status#)"></div></td>
                    <td class="gdfCell indentCell" style="padding-left:(#=obj.level*10+38#)px;">
                        <div class="exp-controller" align="center"></div>
                        <input type="text" class="(#=obj.isLast==false?'readonly':''#)" name="name" value="(#=obj.level#)" placeholder="name">
                    </td>
                    <th class="gdfCell" align="center">
                        <div class="plan-btn pointer (#=obj.isLast==true?'btn-show':'btn-hide'#)">
                            <button onclick="$('#workSpace').trigger('toProjectPlanNesting.gantt');return false;" class="toProjectPlanNesting plan-btn pointer (#=obj.workingProcedureCode =='GX_XL'?'btn-show':'btn-hide'#)">配置套料计划</button>
                            <button onclick="$('#workSpace').trigger('toProjectPlanMaterial.gantt');return false;" class="toProjectPlanMaterial plan-btn pointer (#=obj.workingProcedureCode !='GX_XL'?'btn-show':'btn-hide'#)">配置物料计划</button>
                        </div>
                    </th>
                    <td class="gdfCell"><input type="text" name="start"  value="" class="date (#=obj.isLast==false?'readonly':''#)"></td>
                    <td class="gdfCell"><input type="text" name="end" value="" class="date (#=obj.isLast==false?'readonly':''#)"></td>
                    <td class="gdfCell"><input type="text" name="duration" autocomplete="off" class="(#=obj.isLast==false?'readonly':''#)" value="(#=obj.duration#)"></td>
                    <td class="gdfCell requireCanSeeDep"><input type="text" name="depends" autocomplete="off" class="(#=obj.isLast==false?'readonly':''#)" value="(#=obj.depends#)" /></td>
                </tr>
            </div>

            <div class="__template__" type="TASKEMPTYROW">
                <tr class="taskEditRow emptyRow">
                    <th class="gdfCell" align="right"></th>
                    <td class="gdfCell noClip" align="center"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                    <td class="gdfCell"></td>
                </tr>
            </div>

            <div class="__template__" type="TASKBAR">
                <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)">
                    <div class="layout (#=obj.hasExternalDep?'extDep':''#)">
                        <div class="taskStatus" status="(#=obj.status#)"></div>
                        <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);"></div>
                        <div class="milestone (#=obj.startIsMilestone?'active':''#)"></div>

                        <div class="taskLabel"></div>
                        <div class="milestone end (#=obj.endIsMilestone?'active':''#)"></div>
                    </div>
                </div>
            </div>

            <div class="__template__" type="CHANGE_STATUS">
                <div class="taskStatusBox">
                    <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="Active"></div>
                    <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="Completed"></div>
                    <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="Failed"></div>
                    <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="Suspended"></div>
                    <div class="taskStatus cvcColorSquare" status="STATUS_WAITING" title="Waiting" style="display: none;"></div>
                    <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="Undefined"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { achieveProjectAndCouplingPlan, projectMasterPlanSave,projectCouplingPlanSave,projectWorkingProcedurePlanSave,modifyRoundsPlan,deletedRoundsPlan  } from '@/api/productionManagement/projectMasterPlan.js'
import { time } from '@/utils/productionManagement/tool.js'
export default {
    data(){
        return{
            dialogFormVisible: false,
            loading: true,
            renderData: {
                tasks:[],
                deletedTaskIds: [],
                resources: [],
                roles:[],
                canWrite: true,
                canDelete: true,
                canWriteOnParent: true,
                canAdd: true
            }
        }
    },
    computed: {
        ...mapGetters(['projectEvents'])
    },
    mounted() {
        this.getAchieveProjectAndCouplingPlan(this.$route.query.masterPlanId);
    },
    methods: {
        // 数据处理, 将不同名称的数组全部统一名称为children
        listToTree(obj){
            Object.keys(obj).forEach((key)=>{
                let childrenName = key;
                // 数据中包含轮次数组的为工序或子工序
                // 根据后端传的数据格式, 此处需要自行判断children具体从哪个数组取值
                if(key === 'projectWorkingProcedureRoundsPlanList'){
                    if(!obj.children){ //数据中没有children确认为子工序
                        obj['hasAddChildPower'] = true; //赋予添加权限
                        childrenName = 'projectWorkingProcedureRoundsPlanList';
                    }else{
                        // 如果数组中有children, 但数组为空, 那么则确认当前数据为工序
                        // children/projectWorkingProcedureRoundsPlanList 只会有一个数组有值
                        if(!obj.children.length){
                            obj['hasAddChildPower'] = true; //赋予添加权限
                            childrenName = 'projectWorkingProcedureRoundsPlanList';
                        }else{
                            childrenName = 'children';
                        }
                    }
                }
                if(obj[key] instanceof Array){ // 处理项目,联段,工序,子工序数据
                    obj['children'] = obj[childrenName];
                    // 将名称不为children的多余数组删除, 避免数据过于杂乱
                    if(key != 'children'){
                        delete obj[key];
                    }
                    this.assignTasksData(obj);
                    obj.children.forEach((item)=>{
                        this.listToTree(item);
                    })
                }
                if(key === 'roundsPlanId'){ //处理轮次数据
                    this.assignTasksData(obj);
                }
            })
            return obj;
        },
        // 将树状数组扁平化,处理为project需要的数据格式,添加level
        treeToTask(obj,level =0){
            obj.level = level
            let newObj = Object.assign({},obj);
            if(newObj.children){
                ++level
            }
            this.renderData.tasks.push(newObj);
            if(obj.children){
                obj.children.forEach((item)=>{
                    this.treeToTask(item,level);
                })
            }
        },
        // 将当前获取的数据, 与project每行需要的数据进行合并与处理
        assignTasksData(item){
            return Object.assign(item,{
                roundsPlanId: item.roundsPlanId || undefined,
                workingProcedureCode: item.workingProcedureCode|| undefined,
                workingProcedurePlanId: item.workingProcedurePlanId || undefined,
                couplingId: item.couplingId || undefined,
                couplingPlanId: item.couplingPlanId || undefined,
                masterPlanId: item.masterPlanId,
                id: item.roundsPlanId|| item.workingProcedurePlanId||item.couplingPlanId||item.masterPlanId,
                name: item.name,
                depends: item.predecessors||'',
                duration: item.duration,
                start: item.startTime? Date.parse(new Date(item.startTime)):new Date().getTime(),
                end: item.endTime? Date.parse(new Date(item.endTime)):new Date().getTime(),
                status: "STATUS_ACTIVE",
                collapsed: false,
                hasChild: true,
                hasAddChildPower: item.hasAddChildPower||false,
                isLast: item.roundsPlanId?true:false, //如果当前层级有轮次id, 确认为最后一层
            })
        },
        // 获取页面数据
        getAchieveProjectAndCouplingPlan(masterPlanId){
            let formData = new FormData();
            formData.append('masterPlanId', masterPlanId);
            achieveProjectAndCouplingPlan(formData).then((res)=>{
                this.treeToTask(this.listToTree(res.data))
                this.initPorject(this.renderData);
                this.loading = false;
            })
        },
        // 初始化甘特图
        initPorject(data){
            let ge;
            let _this = this;
            $(function() {
                ge = new GanttMaster();
                ge.set100OnClose = true;
                ge.shrinkParent = true;
                ge.init($("#workSpace"));
                delete ge.gantt.zoom;
                ge.loadProject(data);
                _this.handleProjectEvent(ge);
                _this.handleEventListener(ge);
            });
        },
        // 处理project修改后的数据, 转换为提交所需数据
        taskToSubmitData(data, tasks, row, level){
            let currentTask = this.getCurrentTask(tasks, row, level);
            return {
                roundsPlanId: data.roundsPlanId,
                workingProcedureCode: data.workingProcedureCode,
                workingProcedurePlanId: data.workingProcedurePlanId,
                couplingId: data.couplingId,
                couplingPlanId: data.couplingPlanId,
                masterPlanId: data.masterPlanId,
                engineeringProjectId: this.$route.query.engineeringProjectId,
                duration: currentTask.duration,
                endTime: time(currentTask.end),
                name: currentTask.name,
                remark: currentTask.description,
                startTime: time(currentTask.start),
                predecessors: currentTask.depends||''
            }
        },
        // 获取当前task
        getCurrentTask(tasks, row, level){
            let arr = tasks.slice(0,row).reverse();
            let task = arr.find(item=>item.level == level);
            return task;
        },
        // 绑定project中的点击事件
        handleProjectEvent(ge){
            let _this = this;
            ge.workSpace.bind("toProjectPlanNesting.gantt", function(e) { //点击套料
                setTimeout(()=>{
                    if (!ge.currentTask.roundsPlanId) {
                        return
                    }
                    _this.$router.push({
                        name: 'project-plan-nesting',
                        query: {
                            engineeringProjectId: _this.$route.query.engineeringProjectId,
                            couplingId: ge.currentTask.couplingId,
                            workingProcedurePlanId: ge.currentTask.workingProcedurePlanId,
                            roundsPlanId: ge.currentTask.roundsPlanId,
                        }
                    });
                })
            })
            ge.workSpace.bind("toProjectPlanMaterial.gantt", function(e) { //点击套料
                setTimeout(()=>{
                    if (!ge.currentTask.roundsPlanId) {
                        return
                    }
                    _this.$router.push({
                        name: 'project-plan-material',
                        query: {
                            engineeringProjectId: _this.$route.query.engineeringProjectId,
                            couplingId: ge.currentTask.couplingId,
                            workingProcedurePlanId: ge.currentTask.workingProcedurePlanId,
                            roundsPlanId: ge.currentTask.roundsPlanId,
                            couplingPlanId: ge.currentTask.couplingPlanId,
                            masterPlanId: ge.currentTask.masterPlanId,
                            workingProcedureCode: ge.currentTask.workingProcedureCode,
                        }
                    });
                })
            })
            ge.workSpace.bind("deleteFocused.gantt", function(e) { // 点击删除
                let currentIndex = ge.tasks.findIndex(val=>val.id == ge.currentTask.id)+1;
                let hasLink = ge.links.find(link=>link.to.depends.split(':')[0] == currentIndex)
                if(hasLink){
                    _this.$message.error('当前轮次为其他轮次的前置任务, 请先解除绑定!');
                    return
                }
                if(ge.currentTask.isLast){
                    setTimeout(()=>{
                        deletedRoundsPlan(ge.currentTask.roundsPlanId).then((res)=>{
                            _this.$message.success('删除成功')
                            ge.deleteCurrentTask(undefined,'delete');
                        })
                    })
                }
            })
        },
        // 监听project实时修改的值, 并向后端传递数据
        handleEventListener(ge){
            if(!this.projectEvents.find(value=>value=='projectEvent')){
                this.$store.commit('project/ADD_EVENT','projectEvent')
                document.addEventListener('projectEvent', (e)=>{
                    let data = e.detail.data;
                    let tasks = e.detail.tasks;
                    let row = e.detail.row;
                    // 项目与联段的level为固定的0或1, 工序/子工序可能为2或3, 轮次可能为3,4
                    // 通过获取最后一层级的level, 倒推出工序/子工序的level,并获取出对应数据
                    // 修改轮次必须重新提交所有的数据, 包括项目,父级联段, 父级工序/子工序数据
                    modifyRoundsPlan(this.taskToSubmitData(data, tasks, row, data.level)).then((res)=>{ // 轮次
                        ge.refreshTaskRowRoundsPlanId(Object.assign(data,{'roundsPlanId':res.data.roundsPlanId}));
                        this.$message.success('编辑成功')
                        projectWorkingProcedurePlanSave(this.taskToSubmitData(data, tasks, row, data.level-1)).then(()=>{ // 工序
                            projectCouplingPlanSave(this.taskToSubmitData(data, tasks, row, 1)).then(()=>{ // 联段
                                projectMasterPlanSave(this.taskToSubmitData(data, tasks, row, 0)).then(()=>{
                                }).catch(()=>{
                                    this.$message.error('项目修改失败')
                                })
                            }).catch(()=>{
                                this.$message.error('联段修改失败')
                            })
                        }).catch(()=>{
                            this.$message.error('工序修改失败')
                        })
                    }).catch(()=>{
                        // 待修改
                        // console.log("这里")
                        // this.$message.error('轮次修改失败')
                    })
                })
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.sub-page{
    position: relative;
    background: #FFFFFF;
}
.resEdit {
    padding: 15px;
}

.resLine {
    width: 95%;
    padding: 3px;
    margin: 5px;
    border: 1px solid #d0d0d0;
}

body {
    overflow: hidden;
}

.ganttButtonBar h1 {
    color: #000000;
    font-weight: bold;
    font-size: 28px;
    margin-left: 10px;
}
.back-btn{
    position: absolute;
    right: 40px;
    top: 30px;
    z-index: 99;
}
.readonly{
    pointer-events: none !important;
    color: #999 !important;
}
.first-btn{
    margin-left: 30px;
}
.plan-btn{
    font-size: 12px;
    background: #3BBF67;
    border: 0;
    color: #FFFFFF;
    border-radius: 2px;
}
.btn-show{
    display: inline-block !important;
}
.btn-hide{
    display: none;
}
.download-btn{
    position: absolute;
    left:200px;
    top: 25px;
    font-size: 16px;
    color: #303133;
    z-index: 10;
    font-weight: 500;
}
</style>
