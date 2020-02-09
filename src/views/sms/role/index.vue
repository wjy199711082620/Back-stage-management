 <template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="角色名称：">
            <el-input class="input-width" v-model="listQuery.roleName" placeholder="角色名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
	  <el-button size="mini" class="btn-add" @click="handleAdd()">添加角色</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newSubjectTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.roleId}}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="角色权限" align="center">
          <template slot-scope="scope">{{scope.row.authoritys}}</template>
        </el-table-column>
        <el-table-column label="描述" width="120" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.activated}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加/修改 角色" :visible.sync="roleDialogVisible" width="50%">
     <el-form :model="flashPromotion"
               ref="flashPromotionForm"
               label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="flashPromotion.roleName" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input
		  class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入描述内容" v-model="flashPromotion.description" style="width: 400px"></el-input>
        </el-form-item>

     	<el-form-item label="权限选择">
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
 			 <div style="margin: 15px 0;"></div>
 				 <el-checkbox-group v-model="checkedAuthoritys" @change="handleCheckedAuthoritysChange">
   				 <el-checkbox v-model="flashPromotion.authoritys"
					v-for="item in authorityOptions"
					:label="item.id"
					:key="item.id">{{item.label}}
				</el-checkbox>
  			</el-checkbox-group>
     	</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button  size="small" @click="roleDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList as fetchRoleList,createRole,updateRole} from '@/api/role';
  import {authorityList} from '@/api/authority';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
	roleName: null
  };
	const defaultflashPromotion ={authoritys:null};

  export default {
    name: 'homeRoleList',
    data() {
      return {
		listQuery: Object.assign({}, defaultListQuery),
        list: null,
		total: null,
        listLoading: false,
		multipleSelection: [],
		authorityOptions:[],
		operates: [
          {
            label: "删除",
            value: 2
          }
		],
        flashPromotion:Object.assign({}, defaultflashPromotion),
        operateType: null,
        roleDialogVisible:false,
		isEdit:false,
		checkAll: false,
        checkedAuthoritys: [],
        isIndeterminate: true
      }
    },
    created() {
	  this.getList();
    },
    filters:{
      formatRecommendStatus(activated){
        if(activated===1){
          return '禁用';
        }else{
          return '启用';
        }
      },
      formatTime(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
	},
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
	  },
	   handleAdd() {
		this.getAuthoritys();
        this.roleDialogVisible = true;
		this.isEdit = false;
		this.flashPromotion = Object.assign({},defaultflashPromotion);
	  },
	   handleEdit(index,row){
		   this.getAuthoritys();
		  if(row.authoritys){
			 this.checkedAuthoritys = row.authoritys.split(",")
		  };
        this.roleDialogVisible = true;
		this.isEdit = true;
		this.flashPromotion = Object.assign({},row);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleRecommendStatusStatusChange(index,row){
        this.updateRecommendStatusStatus(row.id,row.recommendStatus);
      },
      handleDelete(index,row){
        this.deleteSubject(row.feedbackId);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];

        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].feedbackId);
        }

        console.log('ids' + ids);
        if (this.operateType === 0) {
          //设为推荐
          this.updateRecommendStatusStatus(ids,1);
        } else if (this.operateType === 1) {
          //取消推荐
          this.updateRecommendStatusStatus(ids,0);
        } else if(this.operateType===2){

          //删除
          this.deleteSubject(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
	  handleCheckAllChange(val) {
		  debugger;
        this.checkedAuthoritys = val ? this.authorityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedAuthoritysChange(value) {
		  debugger;
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.authorityOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.authorityOptions.length;
      },
      handleSelectDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
			 this.flashPromotion.authoritys=this.checkedAuthoritys.toString();
            updateRole(this.flashPromotion.roleId,this.flashPromotion).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.roleDialogVisible =false;
              this.getList();
            })
          } else {
			  this.flashPromotion.authoritys=this.checkedAuthoritys.toString();
            createRole(this.flashPromotion).then(response => {

              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.roleDialogVisible =false;
              this.getList();
            })
          }
        })
      },
	   getAuthoritys() {
        authorityList().then(response => {
			this.authorityOptions=[];
		  let list = response.data;
          for (let i = 0; i < list.length; i++) {
            this.authorityOptions.push({label: list[i].pageName, id: list[i].authorityId});
          }
        })
      },
      getList() {
        this.listLoading = true;
        fetchRoleList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        })
      }
    }
  }
</script>
<style></style>
