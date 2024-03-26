/**
 * @jest-environment jsdom
 */

import {screen, waitFor,fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import router from "../app/Router.js"
import { ROUTES_PATH} from "../constants/routes.js"
import mockStore from '../__mocks__/store'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      const isActive = mailIcon.classList.contains('active-icon')
      expect(isActive).toBeTruthy()

    })
  })
  describe ("When I am on NewBill form", () => {
    describe("When I choose a file with an allowed extension", ()=>{
      test("Then I add File", async () => {
        const dashboard = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: localStorageMock,
        })
    
        const handleChangeFile = jest.fn(dashboard.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
          target: {
            files: [
              new File(["document.jpg"], "document.jpg", {
                type: "image/jpg",
              }),
            ],
          },
        })
    
        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toBeCalled()
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
      })
    })
    describe("When I choose a file with a not allowed extension ", () => {
      test("Then I get an error message", () => {
        const dashboard = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: localStorageMock,
        })
    
        const handleChangeFile = jest.fn(dashboard.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);
        fireEvent.change(inputFile, {
          target: {
            files: [
              new File(["document.txt"], "document.txt", {
                type: "text/plain", // Modifié pour correspondre au type MIME correct
              }),
            ],
          },
        })
    
        // Vérification que le message d'erreur est présent après le changement de fichier
        expect(screen.getByText("Seuls les fichiers .png, .jpg et .jpeg sont autorisés.")).toBeTruthy()
      })
    })
    
  })
  describe("When I submit the form", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      )
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
  
    describe("user submit form valid", () => {
      test("call api update bills", async () => {
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localeStorage: localStorageMock,
        })
        const handleSubmit = jest.fn(newBill.handleSubmit)
        const form = screen.getByTestId("form-new-bill")
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form)
        expect(mockStore.bills).toHaveBeenCalled()
      })
    })
  })
  
  

})
