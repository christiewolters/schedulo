package learn.shift_scheduler.models;

import java.util.Objects;

public class Employee {
    private int employeeId;
    private String firstName;
    private String lastName;
    private int appUserId;

    private double wage;



    public Employee(){
    }

    public Employee(int employeeId, String firstName, String lastName, int appUserId, double wage) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.appUserId = appUserId;
        this.wage = wage;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
    }

    public double getWage() {
        return wage;
    }

    public void setWage(double wage) {
        this.wage = wage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return employeeId == employee.employeeId && appUserId == employee.appUserId && Objects.equals(firstName, employee.firstName) && Objects.equals(lastName, employee.lastName) && wage == employee.wage;
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, firstName, lastName, appUserId, wage);
    }
}
