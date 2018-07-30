﻿using System.Threading.Tasks;
using Abp.Timing;
using Magicodes.Admin.Core.Custom.LogInfos;
using Magicodes.App.Application.Users;
using Magicodes.App.Application.Users.Dto;
using Shouldly;
using Xunit;

namespace App.Tests.Users
{
    public class Users_Tests : AppTestBase
    {
        private readonly IUsersAppService usersAppService;

        public Users_Tests()
        {
            usersAppService = Resolve<IUsersAppService>();
        }

        [Theory(DisplayName = "注册")]
        [InlineData("Test", "Test", "9957fc0fa630436e821b9e087b76aaf4", (AppRegisterInput.FromEnum)0, "0f36dbb147c7478ebab94cd68a33202e", "Test")]
        public async Task AppRegister_Test(string phone, string code, string openId, AppRegisterInput.FromEnum from, string unionId, string trueName)
        {
            UsingDbContext((context) => context.SmsCodeLogs.Add(new SmsCodeLog()
            {
                CreationTime = Clock.Now,
                Phone = phone,
                SmsCode = code,
                SmsCodeType = SmsCodeTypes.Register
            }));

            var input = new AppRegisterInput()
            {
                Phone = phone,
                Code = code,
                OpenId = openId,
                From = from,
                UnionId = unionId,
                TrueName = trueName,
            };
            var output = await usersAppService.AppRegister(input);
            output.ShouldNotBeNull();
        }

        [Theory(DisplayName = "登陆", Skip = "暂不实现APP登陆")]
        [InlineData("Test", "Test")]
        public async Task AppLogin_Test(string phone, string code)
        {
            var input = new AppLoginInput()
            {
                Phone = phone,
                Code = code,
            };
            var output = await usersAppService.AppLogin(input);
            output.ShouldNotBeNull();
        }

        [Theory(DisplayName = "授权访问")]
        [InlineData("e8083f0bb73f4c2dbf687fce2d1c8009", (Magicodes.App.Application.Users.Dto.AppTokenAuthInput.FromEnum)0)]
        [InlineData("e8083f0bb73f4c2dbf687fce2d1c8010", (Magicodes.App.Application.Users.Dto.AppTokenAuthInput.FromEnum)0)]
        public async Task AppTokenAuth_Test(string openIdOrUnionId, Magicodes.App.Application.Users.Dto.AppTokenAuthInput.FromEnum from)
        {
            var input = new AppTokenAuthInput()
            {
                OpenIdOrUnionId = openIdOrUnionId,
                From = from,
            };
            var output = await usersAppService.AppTokenAuth(input);
            output.ShouldNotBeNull();
        }
    }
}