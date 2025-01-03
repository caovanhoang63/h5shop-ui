import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Search, Plus, User, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { listCustomer } from "@/pages/sale/api/customerApi.ts";
import { Customer } from "@/types/customer/customer.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import _ from "lodash";
import { CreateCustomerModal } from "@/pages/sale/components/CustomerModal.tsx";

interface CustomerSearchProps {
  onCustomerChange: (customer: Customer | undefined) => void;
  customerValue?: Customer;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  onCustomerChange,
  customerValue,
}) => {
  const [isCustomerCreateOpen, setIsCustomerCreateOpen] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchCustomerResult, setSearchCustomerResult] =
    useState<Customer[]>();

  useEffect(() => {
    if (customerValue) {
      setSearchCustomerResult(undefined); // Clear search results if customer is set
    }
  }, [customerValue]);

  const debounceSearchCustomer = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setSearchCustomerResult(undefined);
        } else {
          const filter: CustomerListFilter = {
            lkPhoneNumber: query,
            status: [1],
          };
          listCustomer(filter)
            .then((response) => {
              setSearchCustomerResult(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, 500),
    [],
  );

  const handleSearchCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchCustomer(query);
    debounceSearchCustomer(query);
  };

  return (
    <div className="relative w-full p-2 flex items-center">
      {customerValue ? (
        <Button className="h-9 w-full justify-start bg-gray-200 text-primary hover:bg-gray-200 shadow-none">
          <User />
          {customerValue.phoneNumber} - {customerValue.lastName}{" "}
          {customerValue.firstName}
          <Button
            onClick={() => onCustomerChange(undefined)}
            className="p-1 ml-auto h-6 w-6 bg-transparent text-black hover:bg-gray-300 rounded-full shadow-none"
          >
            <X />
          </Button>
        </Button>
      ) : (
        <div className="w-full relative flex items-center">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-background" />
          <Input
            value={searchCustomer}
            onChange={handleSearchCustomer}
            className="pl-9 bg-background flex-grow"
            placeholder="Tìm khách hàng"
          />
          <Button
            onClick={() => setIsCustomerCreateOpen(true)}
            className="absolute right-3 p-1 h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none"
          >
            <Plus />
          </Button>
        </div>
      )}
      {searchCustomerResult && searchCustomer.trim() !== "" && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
          {searchCustomerResult.map((customer) => (
            <div
              key={customer.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onCustomerChange(customer);
                setSearchCustomer("");
                setSearchCustomerResult(undefined);
              }}
            >
              <span className="text-gray-500">{customer.phoneNumber}</span> -{" "}
              <span className="font-medium">
                {customer.lastName} {customer.firstName}
              </span>
            </div>
          ))}
        </div>
      )}
      <CreateCustomerModal
        isOpen={isCustomerCreateOpen}
        onClose={() => setIsCustomerCreateOpen(false)}
      />
    </div>
  );
};
