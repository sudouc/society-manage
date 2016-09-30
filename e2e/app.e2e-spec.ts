import { SudoMembershipsPage } from './app.po';

describe('sudo-memberships App', function() {
  let page: SudoMembershipsPage;

  beforeEach(() => {
    page = new SudoMembershipsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
