﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Admin.Controllers.Admin.Sys
{
    using System.Collections;
    using Entitys.SysClass;
    using Logic;
    using Logic.SysClass;
    using Microsoft.AspNetCore.Http;
    using DbFrame;
    using Toolkit;

    /// <summary>
    /// 功能管理
    /// </summary>
    public class FunctionController : AdminBaseController
    {

        protected Sys_FunctionLogic _Logic = new Sys_FunctionLogic();

        #region 增、删、改、查

        /// <summary>
        /// 数据源
        /// </summary>
        /// <param name="Page"></param>
        /// <param name="Rows"></param>
        /// <param name="Search"></param>
        /// <returns></returns>
        [NonAction]
        protected override async Task<TableViewModel> DataSourceAsync(int Page, int Rows, Hashtable Search) => await _Logic.FindList(Page, Rows, Search);

        /// <summary>
        /// 查询列表
        /// </summary>
        /// <param name="Page">页码</param>
        /// <param name="Rows">每页显示多少条</param>
        /// <param name="_IFormCollection">参数</param>
        /// <returns></returns>
        [HttpPost(nameof(FindList)), AppService.ApiCheckTokenFilter]
        public async Task<TableViewModel> FindList(int Page, int Rows, IFormCollection _IFormCollection)
        {
            _Logic._Account = this._Account;//将当前用户信息传入 Logic层
            var _HashtableQuery = this.FormCollectionToHashtable(_IFormCollection);
            var _DataViewModel = await this.DataSourceAsync(Page, Rows, _HashtableQuery);
            return _DataViewModel;
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost(nameof(Save)), AppService.ApiCheckTokenFilter]
        public IActionResult Save(Sys_Function model)
        {
            this.FormKey = _Logic.Save(model);

            return Json();
        }

        /// <summary>
        /// 移除数据
        /// </summary>
        /// <param name="Id">Id集合</param>
        /// <returns></returns>
        [HttpPost(nameof(Delete)), AppService.ApiCheckTokenFilter]
        public IActionResult Delete(List<Guid> Id)
        {
            _Logic.Delete(Id);
            return Json();
        }

        /// <summary>
        /// 加载表单
        /// </summary>
        /// <param name="Id">主表Id</param>
        /// <returns></returns>
        [HttpPost(nameof(LoadForm)), AppService.ApiCheckTokenFilter]
        public IActionResult LoadForm(Guid? Id)
        {
            return Json(new
            {
                status = 1,
                Form = _Logic.LoadForm(Id)
            });
        }

        #endregion

        #region 其他



        #endregion








    }
}