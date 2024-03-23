describe('Hone application', () => {

  beforeEach(() => {
    cy.login("cypress@gmail.com");
  })

  it('should create, read, update, and delete projects, entries, and comments', () => {
    // Create new project
    cy.contains("+ Create new project").click()
    cy.get("h1").should("contain", "Untitled")

    // Edit and read project description
    cy.contains("edit").click()
    cy.get("#editable-description").type("New description!")
    cy.get("#editable-title").type("New title!")
    cy.contains("Submit").click()
    cy.get("h1").should("contain", "New title!")
    cy.get(".title-p").should("contain", "New description!")

    // Create new entry
    cy.contains("+ Create new entry").click()
    cy.get("#input-new-description").type("New entry!")
    cy.get("#new-entry-create-btn").click()
    cy.get(".entry-p").should("contain", "New entry!")

    // Edit and read entry
    cy.get(".entry-date-button-container").find(".edit-entry-btn").contains("edit").click()
    cy.get("#editable-entry-description").type("And updated! ")
    cy.get("#entry-submit-btn").click()
    cy.get(".entry-p").should("contain", "And updated! New entry!")

    // Create and read new comment
    cy.get(".entry-date-button-container").find(".edit-entry-btn").contains("chat").click()
    cy.get("input[placeholder=\"Add a comment...\"]").type("new comment!")
    cy.get(".comment-submit-btn").click()
    cy.get(".profile-name-comment-container p").should("contain", "new comment!")

    // Delete comment
    cy.get(".delete-comment-btn").click()
    cy.get(".profile-name-comment-container").should("not.exist")
    cy.get(".modal-close-btn").click()

    // Delete entry
    cy.get(".entry-date-button-container").find(".edit-entry-btn").contains("delete").click()
    cy.get("#delete-project-btn").click()
    cy.get(".entry-container").should("not.exist")

    // Delete project
    cy.contains("Delete project ✕").click()
    cy.get("#delete-project-btn").click()
    cy.url().should("include", "/cypress")
    cy.get("h1").should("contain", "cypress")
  })

  it("should navigate to correct pages when links in menu bar are clicked", () => {
    // Calendar
    cy.get(".menu-button").click()
    cy.get(".menu-display-name").contains("cypress")
    cy.contains("Your calendar").click()
    cy.url().should("include", "/cypress/calendar")
    cy.get("#calendar").should("exist")

    // Profile page
    cy.get(".menu-button").click()
    cy.contains("Your profile").click()
    cy.url().should("include", "/cypress")
    cy.get('h1').should('contain', 'cypress')

    // Inspiration page
    cy.get(".menu-button").click()
    cy.contains("Inspiration").click()
    cy.url().should("include", "/inspiration")
    cy.get(".inspiring-entry").should("exist")

    // Log out
    cy.get(".menu-button").click()
    cy.contains(" Logout →").click()
    cy.get(".root-container").should("exist")
  })

  it("should search for projects", () => {
    cy.get(".chakra-input__group").click()
    cy.get(".chakra-modal__header").find(".chakra-input").click().type("Test")
    cy.get(".css-18xigx5").should("exist").click()
    cy.url().should("include", "/cypress/projects/42")
  })

  it("should not have editing capabilities when viewing other users", () => {
    cy.visit("/yurika")
    cy.get("h1").should("contain", "Yurika H.")
    cy.get(".edit-profile-btn").should("not.exist")
    cy.get(".new-project-btn").should("not.exist")
  })
})