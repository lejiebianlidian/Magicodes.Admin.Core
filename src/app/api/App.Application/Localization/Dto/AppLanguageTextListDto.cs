﻿// ======================================================================
//   
//           Copyright (C) 2018-2020 湖南心莱信息科技有限公司    
//           All rights reserved
//   
//           filename : AppLanguageTextListDto.cs
//           description :
//   
//           created by 雪雁 at  2018-09-04 10:16
//           Mail: wenqiang.li@xin-lai.com
//           QQ群：85318032（技术交流）
//           Blog：http://www.cnblogs.com/codelove/
//           GitHub：https://github.com/xin-lai
//           Home：http://xin-lai.com
//   
// ======================================================================

namespace Magicodes.App.Application.Localization.Dto
{
    /// <summary>
    ///     APP语言列表对象
    /// </summary>
    public class AppLanguageTextListDto
    {
        /// <summary>
        ///     语言key
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        ///     当前语言值（默认使用用户当前定义的语言）
        /// </summary>
        public string Value { get; set; }
    }
}