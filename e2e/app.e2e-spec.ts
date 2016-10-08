import { AppCsvPage } from './app.po';

describe('app-csv App', function() {
  let page: AppCsvPage;

  beforeEach(() => {
    page = new AppCsvPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
