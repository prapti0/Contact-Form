
package com.example.contactbackend.service;

import com.example.contactbackend.dto.ContactRequestDTO;
import com.example.contactbackend.dto.ContactResponseDTO;
import com.example.contactbackend.dto.PagedResponseDTO;
import com.example.contactbackend.entity.Contact;
import com.example.contactbackend.entity.QContact;
import com.example.contactbackend.repository.ContactRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    public ContactResponseDTO createContact(ContactRequestDTO requestDTO) {
        // Check if email already exists
        if (contactRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + requestDTO.getEmail());
        }
        
        Contact contact = new Contact(
            requestDTO.getName(),
            requestDTO.getEmail(),
            requestDTO.getPhoneNumber(),
            requestDTO.getJobTitle(),
            requestDTO.getCompany()
        );
        
        Contact savedContact = contactRepository.save(contact);
        return mapToResponseDTO(savedContact);
    }
    
    @Transactional(readOnly = true)
    public PagedResponseDTO<ContactResponseDTO> getAllContacts(
            int page, int size, String sortBy, String sortDir, String search) {
        
        // Create sort object
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Build search predicate using QueryDSL
        Predicate predicate = buildSearchPredicate(search);
        
        Page<Contact> contactPage = contactRepository.findAll(predicate, pageable);
        
        List<ContactResponseDTO> responseDTOs = contactPage.getContent()
            .stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            responseDTOs,
            contactPage.getNumber(),
            contactPage.getSize(),
            contactPage.getTotalElements(),
            contactPage.getTotalPages(),
            contactPage.isFirst(),
            contactPage.isLast()
        );
    }
    
    @Transactional(readOnly = true)
    public Optional<ContactResponseDTO> getContactById(Long id) {
        return contactRepository.findById(id)
            .map(this::mapToResponseDTO);
    }
    
    public ContactResponseDTO updateContact(Long id, ContactRequestDTO requestDTO) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        
        // Check if email already exists for another contact
        if (!contact.getEmail().equals(requestDTO.getEmail()) && 
            contactRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + requestDTO.getEmail());
        }
        
        contact.setName(requestDTO.getName());
        contact.setEmail(requestDTO.getEmail());
        contact.setPhoneNumber(requestDTO.getPhoneNumber());
        contact.setJobTitle(requestDTO.getJobTitle());
        contact.setCompany(requestDTO.getCompany());
        
        Contact updatedContact = contactRepository.save(contact);
        return mapToResponseDTO(updatedContact);
    }
    
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
    
    private Predicate buildSearchPredicate(String search) {
        QContact contact = QContact.contact;
        BooleanBuilder builder = new BooleanBuilder();
        
        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = "%" + search.toLowerCase() + "%";
            builder.or(contact.name.toLowerCase().like(searchTerm))
                   .or(contact.email.toLowerCase().like(searchTerm))
                   .or(contact.phoneNumber.like(searchTerm))
                   .or(contact.jobTitle.toLowerCase().like(searchTerm))
                   .or(contact.company.toLowerCase().like(searchTerm));
        }
        
        return builder;
    }
    
    private ContactResponseDTO mapToResponseDTO(Contact contact) {
        return new ContactResponseDTO(
            contact.getId(),
            contact.getName(),
            contact.getEmail(),
            contact.getPhoneNumber(),
            contact.getJobTitle(),
            contact.getCompany(),
            contact.getCreatedAt(),
            contact.getUpdatedAt()
        );
    }
}