import { browser, element, by, protractor } from 'protractor';

export class AdminPage {
    navigateTo() {
        return browser.get('/');
    }

    getUsername() {
        return element(by.css('.m-topbar__username')).getText();
    }

    getTenancyName() {
        return element(by.css('.tenancy-name')).getText();
    }

    async waitForItemToBeVisible(item) {
        let ec = protractor.ExpectedConditions;
        await browser.wait(ec.visibilityOf(element(item)));
    }

    async loginAsHostAdmin() {
        let username = by.name('userNameOrEmailAddress');
        let password = by.name('password');

        await browser.get('/account/login');
        await this.waitForItemToBeVisible(username);

        element(username).sendKeys('admin');
        element(password).sendKeys('123456abcD');
        await element(by.className('m-login__form')).submit();
    }

    async loginAsTenantAdmin() {
        let username = by.name('userNameOrEmailAddress');
        let password = by.name('password');
        let tenantChangeBox = by.css('.tenant-change-box');

        await browser.get('/account/login');

        // open tenant change dialog
        await this.waitForItemToBeVisible(tenantChangeBox);
        await element(tenantChangeBox).element(by.tagName('a')).click();

        // select default Tenant
        let tenancyName = by.name('TenancyName');
        await this.waitForItemToBeVisible(tenancyName);
        element(tenancyName).sendKeys('Default');
        element(tenantChangeBox).element(by.css('.save-button')).click();

        await browser.sleep(1000);

        await browser.get('/account/login');
        await this.waitForItemToBeVisible(username);

        element(username).sendKeys('admin');
        element(password).sendKeys('123456abcD');
        await element(by.className('m-login__form')).submit();
    }
}
