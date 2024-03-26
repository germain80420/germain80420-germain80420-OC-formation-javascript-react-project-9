/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import mockStore from '../__mocks__/store'
import { ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"

import router from "../app/Router.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      const isActive = windowIcon.classList.contains('active-icon')
      expect(isActive).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then when I click on the button New Bill i should be redirected to NewBillPage", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
  
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)
  
      router()
      await window.onNavigate(ROUTES_PATH.Bills)
  
      // Wait for the "New Bill" button to appear in the DOM
      await waitFor(() => screen.getByTestId('btn-new-bill'))
  
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      fireEvent.click(screen.getByTestId('btn-new-bill'))

      // Verifying the redirection by checking the route
      const currentRoute = window.location.hash
      expect(currentRoute).toBe('#employee/bill/new')
    })

    test('then handleClickIconEye shows modal', () => {
      const billsInstance = new Bills({ document: document, onNavigate: jest.fn(), store: mockStore })
      const icon = document.createElement('div')
      icon.setAttribute('data-bill-url', 'mockBillUrl')
    
      // Mock the modal function directly on the prototype of window.$
      window.$.fn.modal = jest.fn()
    
      billsInstance.handleClickIconEye(icon)
    
      // Checking if the modal function was called with the expected parameters
      expect(window.$.fn.modal).toHaveBeenCalledWith('show')
    })
    test('getBills successfully retrieves bills from the mock store', async () => {
      const billsComponent = new Bills({ document, onNavigate, store: mockStore })
      const getBillsPromise = billsComponent.getBills()
    
      await getBillsPromise
    
      
      // Access the bills directly from the mock store after the promise resolves
      const billsFromStore = await mockStore.bills().list()
    
      // Verify that the `getBills` method returned an array of bills
      expect(Array.isArray(billsFromStore)).toBe(true)
      expect(billsFromStore.length).toBe(4)
    });
    
    
		
  })
  
})
