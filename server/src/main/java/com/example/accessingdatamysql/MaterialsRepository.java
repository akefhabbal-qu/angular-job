package com.example.accessingdatamysql;

import org.springframework.data.repository.CrudRepository;

import com.example.accessingdatamysql.User;

// This will be AUTO IMPLEMENTED by Spring into a Bean called materialsRepository
// CRUD refers Create, Read, Update, Delete

public interface MaterialsRepository extends CrudRepository<Materials, Integer> {

}
