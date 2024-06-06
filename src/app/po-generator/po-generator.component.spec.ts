import { ComponentFixture, TestBed } from "@angular/core/testing";

import { POGeneratorComponent } from "./po-generator.component";

describe("POGeneratorComponent", () => {
  let component: POGeneratorComponent;
  let fixture: ComponentFixture<POGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [POGeneratorComponent],
    });
    fixture = TestBed.createComponent(POGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
