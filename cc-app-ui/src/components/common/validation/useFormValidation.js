import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation using Zod schemas
 * @param {Object} schema - Zod schema for validation
 * @returns {Object} - Validation utilities
 */
const useFormValidation = (schema) => {
  const [errors, setErrors] = useState({});

  /**
   * Validate entire form data
   * @param {Object} data - Form data to validate
   * @returns {Object} - { isValid, errors }
   */
  const validate = useCallback((data) => {
    try {
      schema.parse(data);
      setErrors({});
      return { isValid: true, errors: {} };
    } catch (error) {
      const formattedErrors = {};

      // Zod uses 'issues' not 'errors'
      if (error.issues) {
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = issue.message;
          }
        });
      }

      setErrors(formattedErrors);
      return { isValid: false, errors: formattedErrors };
    }
  }, [schema]);

  /**
   * Validate a single field
   * @param {string} fieldName - Field name (supports nested paths like 'address.city')
   * @param {any} value - Field value
   * @param {Object} fullData - Complete form data (needed for dependent validations)
   * @returns {string|null} - Error message or null
   */
  const validateField = useCallback((fieldName, value, fullData = {}) => {
    try {
      // Create a partial object for validation
      const pathParts = fieldName.split('.');
      let dataToValidate = { ...fullData };

      // Update the specific field value
      if (pathParts.length === 1) {
        dataToValidate[fieldName] = value;
      } else if (pathParts.length === 2) {
        dataToValidate[pathParts[0]] = {
          ...dataToValidate[pathParts[0]],
          [pathParts[1]]: value,
        };
      }

      schema.parse(dataToValidate);

      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      return null;
    } catch (error) {
      // Zod uses 'issues' not 'errors'
      const fieldError = error.issues?.find((issue) => issue.path.join('.') === fieldName);

      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: fieldError.message,
        }));
        return fieldError.message;
      }

      return null;
    }
  }, [schema]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   * @param {string} fieldName - Field name to clear
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Set custom error for a field
   * @param {string} fieldName - Field name
   * @param {string} message - Error message
   */
  const setFieldError = useCallback((fieldName, message) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  /**
   * Get error for a specific field (supports nested paths)
   * @param {string} fieldName - Field name
   * @returns {string|undefined} - Error message
   */
  const getError = useCallback((fieldName) => {
    return errors[fieldName];
  }, [errors]);

  /**
   * Check if form has any errors
   * @returns {boolean}
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    getError,
    hasErrors,
  };
};

export default useFormValidation;
