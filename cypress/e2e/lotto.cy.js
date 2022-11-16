const inputSelector = "[data-cy='purchase-amount']";
const buttonSelector = "[data-cy='purchase-button']";
const numbersSelector = "[data-cy='purchase-numbers']";
const iconSelector = "[data-cy='lotto-icon']";
const toggleSelector = ".switch";
const lottoNumberSelector = ".lotto-number";

const ERROR_MESSAGE = "1,000원 단위로 입력하세요.";
const INVALID_ERROR_MESSAGE = "1,000원 단위로 입력하세요.";
const REQUIRED_ERROR_MESSAGE = "금액을 입력하세요.";

describe("로또 어플리케이션을 테스트한다", () => {
  beforeEach(() => {
    cy.visit("../../index.html");
  });

  it("금액을 입력할 input 태그가 있다", () => {
    cy.get(inputSelector).should("exist");
  });

  it("금액은 숫자로 입력할 수 있다", () => {
    cy.get(inputSelector).type("1000");
    cy.get(inputSelector).should("have.value", "1000");
  });

  it("금액은 숫자만 입력가능하다", () => {
    cy.wrap(["1000abc", "abc", "!!"])
      .each((typeValue, i, array) => {
        cy.get(inputSelector).type(typeValue);
      })
      .then(() => {
        cy.get(inputSelector).should("have.value", "1000");
      });
  });

  it("클릭할 수 있는 확인 버튼이 있다", () => {
    cy.get(buttonSelector).should("exist");
    cy.get(buttonSelector).click();
  });

  it("금액을 입력하지 않은 경우 alert를 띄어준다", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(buttonSelector)
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(REQUIRED_ERROR_MESSAGE);
      });
  });

  it("1,000원 단위로 입력하지 않은 경우 alert를 띄어준다.", () => {
    cy.get(inputSelector).type("1500");
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(buttonSelector)
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(INVALID_ERROR_MESSAGE);
      });
  });

  it("금액을 음수로 입력한 경우 alert를 띄어준다.", () => {
    cy.get(inputSelector).type("-1000");
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(buttonSelector)
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(INVALID_ERROR_MESSAGE);
      });
  });

  it("구입할 금액을 입력하고 확인 버튼을 누르면 금액에 해당하는 로또 개수와 아이콘을 표시한다.", () => {
    cy.get(inputSelector).type("3000");
    cy.get(buttonSelector).click();

    cy.get(numbersSelector).contains("3");
    cy.get(iconSelector).should("have.length", 3);
  });

  it("로또 발급 후에는 번호보기 토글 버튼이 존재한다", () => {
    cy.get(inputSelector).type("3000");
    cy.get(buttonSelector).click();
    cy.get(toggleSelector).should("exist");
  });

  it("로또 발급 후에는 번호보기 토글 버튼이 OFF 상태이다", () => {
    cy.get(inputSelector).type("3000");
    cy.get(buttonSelector).click();
    cy.get(toggleSelector).should("not.be.checked");
  });

  it("번호보기 토글을 ON하면 복권 번호가 각각 표시된다", () => {
    cy.get(inputSelector).type("3000");
    cy.get(buttonSelector).click();
    cy.get(toggleSelector).click();
    cy.get(lottoNumberSelector).should("be.visible");
  });

  it("번호보기 토글을 OFF하면 복권 번호가 사라진다", () => {
    cy.get(inputSelector).type("3000");
    cy.get(buttonSelector).click();
    cy.get(toggleSelector).click();
    cy.get(toggleSelector).click();

    cy.get(lottoNumberSelector).should("not.be.visible");
  });
});
