﻿using System.Threading.Tasks;
using Abp.Application.Services;
using Magicodes.App.Application.Users.Dto;

namespace Magicodes.App.Application.Users
{
    /// <summary>
    ///     用户
    /// </summary>
    public interface IUsersAppService : IApplicationService
    {
        /// <summary>
        ///     注册
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<AppRegisterOutput> AppRegister(AppRegisterInput input);

        /// <summary>
        ///     登陆
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<AppLoginOutput> AppLogin(AppLoginInput input);

        /// <summary>
        ///     授权访问
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<AppTokenAuthOutput> AppTokenAuth(AppTokenAuthInput input);
    }
}